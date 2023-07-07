import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PreviewQuiz.css";
import QuizNavigation from "./QuizNavigation";

function PreviewQuiz() {
  const [quesInQuizList, setQuesInQuizList] = useState([]);
  const [choiceChosenList, setChoiceChosenList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [flaggedQues, setFlaggedQues] = useState({});
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState();
  const [ongoingAttempt, setOngoingAttempt] = useState(false);

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
        // biến này dùng để gộp qiq và question real
        // qiq = await data.quesInQuizList
        const quesInQuizListUpdated = data.quesInQuizList.map((quesInQuiz) => {
          return {
            ...quesInQuiz,
            // các trường null chuẩn bị chứa thông tin từ question
            categoryID: null,
            text: null,
            choices: null,
          };
        });
        setOngoingAttempt(data.quiz.ongoingAttempt);
        setTimeLimit(data.quiz.timeLimit * 60);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        // Convert the timeStart to a Date object if it's stored in a different format
        const timeStart = new Date(data.timeStart);

        const elapsedTime =
          currentTime - Math.floor(timeStart.getTime() / 1000); // Elapsed time in seconds
        const remainingTime = data.quiz.timeLimit * 60 - elapsedTime; // Remaining time in seconds

        setTimeLeft(remainingTime);

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
          // biến gộp
          const quesInQuizListWithQuestions = quesInQuizListUpdated.map(
            (quesInQuiz, index) => ({
              ...quesInQuiz,
              categoryID: questions[index].categoryID,
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
    console.log(newChoiceChosenList);

    // sửa choice chosen ở đây
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

  function handleSubmit() {
    //     timeTaken: timeLimit - timeLeft, //hiện giây

    fetch(`http://localhost:8080/api/quiz_attempt/${id}/submit`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý phản hồi từ API sau khi nộp bài
        console.log(data);
        // Chuyển hướng đến trang kết quả bài kiểm tra
        const url = `/MyCourses/QuizInterface/PreviewQuiz/ConfirmFinish/QuizResult?id=${id}`;
        navigate(url);
      });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const url = `/MyCourses/QuizInterface/PreviewQuiz/ConfirmFinish/QuizResult?id=${id}`;
      navigate(url);
    }
  }, [timeLeft]);

  function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className="quiz-page">
      <div className="quiz">
        <header className="quiz-header">
          <div className="quiz-timer">Time left: {formatTime(timeLeft)}</div>
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
                                  ? // đoạn code thế này (duyệt cả list quesInQuiz để đếm số đáp án) có bị thực hiện nhiều lần hơn cần thiết không?
                                    // bởi vì app sẽ load nó lại mỗi lần có thay đổi state
                                    "checkbox"
                                  : "radio"
                              }
                              name={`choices_${questionIndex}`}
                              checked={quesInQuiz.choiceChosen[choiceIndex]}
                              onChange={() =>
                                handleChoiceSelect(questionIndex, choiceIndex)
                              }
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                // __html: choice.choiceText,
                                __html: choice.choiceText,
                              }}
                              // orderVector[quesInQuiz.idInQuiz-1][choiceIndex]-1 : index mới
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
        ongoingAttempt={ongoingAttempt}
        id={id}
        quesInQuizList={quesInQuizList}
        handleNavClick={handleNavClick}
        selectedQuizId={selectedQuizId}
      />
    </div>
  );
}

export default PreviewQuiz;
