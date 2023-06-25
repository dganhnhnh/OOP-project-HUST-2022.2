import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./PreviewQuiz.css";
import { decode } from "html-entities";
import QuizNavigation from "./QuizNavigation";
import QuizSummary from "./QuizSummary ";

function QuizResult() {
  const [quesInQuizList, setQuesInQuizList] = useState([]);
  const [choiceChosenList, setChoiceChosenList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [flaggedQues, setFlaggedQues] = useState({});
  const [ongoingAttempt, setOngoingAttempt] = useState(false);

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

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
        setOngoingAttempt(data.quiz.ongoingAttempt);
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
              })),
            })
          );

          setQuesInQuizList(quesInQuizListWithQuestions);
          console.log(quesInQuizListWithQuestions);
        });
      });
  }, [id]);

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

  return (
    <div className="quiz-page">
      <div className="quiz">
        <QuizSummary id={id}/>
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
                          {/* Hiển thị checkbox đã được chọn */}
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
                              checked={quesInQuiz.choiceChosen[choiceIndex]}
                              disabled // Không cho phép thay đổi đáp án
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: choice.choiceText,
                              }}
                            ></div>
                            {/* Hiển thị tick hoặc dấu x */}
                            {quesInQuiz.choiceChosen[choiceIndex] === 1 &&
                              (quesInQuiz.choiceGrade[choiceIndex] > 0 ? (
                                <span className="correct">✔</span> // Tick xanh cho đáp án đúng
                              ) : (
                                <span className="incorrect">✘</span> // Dấu x đỏ cho đáp án sai
                              ))}
                          </label>
                        </li>
                      ))}
                  </ul>
                  {/* Hiển thị đáp án đúng */}
                </div>
                <p className="correct-answer">
                    The correct answer is:{" "}
                    {quesInQuiz.choices &&
                      quesInQuiz.choices
                        .filter((choice) => choice.grade > 0)
                        .map((choice) => decode(choice.choiceText).replace(/<[^>]+>/g, ""))
                        .join(", ")}
                  </p>
              </div>
            ))}
          </section>
        </main>
      </div>
      <QuizNavigation
        ongoingAttempt={ongoingAttempt}
        quesInQuizList={quesInQuizList}
        handleNavClick={handleNavClick}
        selectedQuizId={selectedQuizId}
      />
    </div>
  );
}

export default QuizResult;
