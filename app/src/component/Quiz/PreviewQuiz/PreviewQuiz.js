import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PreviewQuiz.css";
import QuizNavigation from "./QuizNavigation";

function PreviewQuiz() {
  const [quesInQuizList, setQuesInQuizList] = useState([]);
  const [choiceChosenList, setChoiceChosenList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [flaggedQues, setFlaggedQues] = useState({});

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/quiz_attempt/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // lưu thông tin các câu hỏi vào state và chuyển các câu hỏi có 2 choice trở lên lớn hơn 0 điểm thành dạng chọn nhiều câu trả lời
        const quesInQuizListUpdated = data.quesInQuizList.map((quesInQuiz) => {
          return {
            ...quesInQuiz,
            text: null,
            choices: null,
          };
        });

        setQuesInQuizList(quesInQuizListUpdated);
        setChoiceChosenList(new Array(quesInQuizListUpdated.length).fill([]));

        // lấy thông tin các câu hỏi
        const questionIDs = data.quesInQuizList.map(
          (quesInQuiz) => quesInQuiz.questionID
        );
        Promise.all(
          questionIDs.map((questionID) =>
            fetch(`http://localhost:8080/api/question/${questionID}`).then(
              (response) => response.json()
            )
          )
        ).then((questions) => {
          // cập nhật state với thông tin câu hỏi đã lấy được
          const quesInQuizListWithQuestions = quesInQuizListUpdated.map(
            (quesInQuiz, index) => ({
              ...quesInQuiz,
              text: questions[index].text,
              choices: questions[index].choices.map((choice) => ({
                ...choice,
                chosen: false,
              })),
            })
          );

          setQuesInQuizList(quesInQuizListWithQuestions);
          console.log(quesInQuizListWithQuestions);
        });
      });
  }, [id]);

  function handleChoiceSelect(questionIndex, choiceIndex) {
    const choiceChosen = [...choiceChosenList[questionIndex]];
    choiceChosen[choiceIndex] = !choiceChosen[choiceIndex];
    console.log(choiceChosen);
    const newChoiceChosenList = [
      ...choiceChosenList.slice(0, questionIndex),
      choiceChosen,
      ...choiceChosenList.slice(questionIndex + 1),
    ];

    setChoiceChosenList(newChoiceChosenList);
    const newQuesInQuizList = [...quesInQuizList];
    if (
      newQuesInQuizList[questionIndex].choiceGrade.filter((grade) => grade > 0)
        .length > 1
    ) {
      newQuesInQuizList[questionIndex].choices[choiceIndex].chosen =
        choiceChosen[choiceIndex];
      newQuesInQuizList[questionIndex].choiceChosen[choiceIndex] = choiceChosen[
        choiceIndex
      ]
        ? 1
        : 0;
    } else {
      newQuesInQuizList[questionIndex].choices.forEach((choice, index) => {
        choice.chosen =
          index === choiceIndex ? choiceChosen[choiceIndex] : false;
      });
      for (
        let i = 0;
        i < newQuesInQuizList[questionIndex].choiceChosen.length;
        i++
      ) {
        newQuesInQuizList[questionIndex].choiceChosen[i] = newQuesInQuizList[
          questionIndex
        ].choices[i].chosen
          ? 1
          : 0;
      }
    }
    setQuesInQuizList(newQuesInQuizList);
    console.log(newChoiceChosenList);
    console.log(quesInQuizList);

    fetch(`http://localhost:8080/api/quiz_attempt/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quesInQuizList: newQuesInQuizList,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  const handleNavClick = (idInQuiz) => {
    const questionIndex = quesInQuizList.findIndex(
      (quesInQuiz) => quesInQuiz.idInQuiz === idInQuiz
    );
    if (questionIndex !== -1) {
      document
        .querySelector(`.row:nth-of-type(${questionIndex + 1})`)
        .scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
    }
    setSelectedQuizId(idInQuiz);
  };

  const handleFlaggedQues = (quesId, e) => {
    e.preventDefault();
    setFlaggedQues((prevFlaggedQues) => {
      const updatedFlaggedQues = { ...prevFlaggedQues };
      updatedFlaggedQues[quesId] = !updatedFlaggedQues[quesId];
      return updatedFlaggedQues;
    });
  };

  function handleFinishAttempt() {
    // Calculate mark for each question
    quesInQuizList.forEach((quesInQuiz) => {
      const { choices, choiceGrade, choiceChosen } = quesInQuiz;
      let questionMark = 0;

      if (choices && choices.length > 0) {
        for (let i = 0; i < choices.length; i++) {
          if (choices[i].chosen && choiceGrade[i] > 0) {
            questionMark += choiceGrade[i];
          }
        }
      }

      // Update the question mark in quesInQuiz object
      quesInQuiz.quesMark = questionMark;
    });

    // Calculate total mark
    let totalMark = quesInQuizList.reduce((total, quesInQuiz) => {
      return total + quesInQuiz.quesMark;
    }, 0);

    // PUT the updated quiz attempt data to the API endpoint
    fetch(`http://localhost:8080/api/quiz_attempt/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quesInQuizList: quesInQuizList,
        totalMark: totalMark,
        finished: true,
        timeComplete: new Date(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý phản hồi từ API sau khi nộp bài
        console.log(data);
        // Chuyển hướng đến trang kết quả bài kiểm tra hoặc trang khác tùy vào yêu cầu của bạn
        const url = `/MyCourses/QuizInterface/PreviewQuiz/QuizResult?id=${id}`
        navigate(url);
      });
  }
  

  return (
    <div className="quiz-page">
      <div className="quiz">
        <header className="quiz-header">
          <div className="quiz-timer">00:00</div>
        </header>
        <main>
          <section className="question-container">
            {quesInQuizList.map((quesInQuiz, questionIndex) => (
              <div className="row">
                <div className="quesInQuiz-status">
                  <h4 className="question-index">
                    Question {quesInQuiz.idInQuiz}
                  </h4>
                  {quesInQuiz.choiceChosen.filter((value) => value === 1)
                    .length === 0 && (
                    <p className="quesInQuiz-status-na">Not yet answered</p>
                  )}
                  {quesInQuiz.choiceChosen.filter((value) => value === 1)
                    .length > 0 && (
                    <p className="quesInQuiz-status-a">Answered</p>
                  )}
                  <p>
                    Marked out of{" "}
                    {quesInQuiz.choiceGrade.reduce((a, b) => a + b)}
                  </p>
                  <p
                    onClick={(e) => handleFlaggedQues(quesInQuiz.idInQuiz, e)}
                    className={
                      "quesInQuiz-status-flag" +
                      (flaggedQues[quesInQuiz.idInQuiz] ? " flagged" : "")
                    }
                  >
                    Flag question
                  </p>
                </div>

                <div key={quesInQuiz.idInQuiz} className="quesInQuiz">
                  <h5>Question {quesInQuiz.idInQuiz}</h5>
                  <div
                    dangerouslySetInnerHTML={{ __html: quesInQuiz.text }}
                  ></div>
                  <ul>
                    {quesInQuiz.choices &&
                      quesInQuiz.choices.map((choice, choiceIndex) => (
                        <li key={choice.id}>
                          <label>
                            <input
                              type={
                                quesInQuiz.choiceGrade.filter(
                                  (grade) => grade > 0
                                ).length > 1
                                  ? "checkbox"
                                  : "radio"
                              }
                              name={`choices_${questionIndex}`}
                              checked={choice.chosen}
                              onChange={() =>
                                handleChoiceSelect(questionIndex, choiceIndex)
                              }
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: choice.choiceText,
                              }}
                            ></div>
                          </label>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
      <QuizNavigation
        handleFinishAttempt={handleFinishAttempt}
        quesInQuizList={quesInQuizList}
        handleNavClick={handleNavClick}
        selectedQuizId={selectedQuizId}
      />
    </div>
  );
}

export default PreviewQuiz;