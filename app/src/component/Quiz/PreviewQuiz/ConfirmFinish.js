import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PreviewQuiz.css";

const ConfirmFinish = () => {
  const [quesInQuizList, setQuesInQuizList] = useState([]);
  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();

  function handleSubmit() {
    fetch(`http://localhost:8080/api/quiz_attempt/${id}/submit`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const url = `/MyCourses/QuizInterface/PreviewQuiz/ConfirmFinish/QuizResult?id=${id}`;
        navigate(url);
      });
  }

  function handleReturn() {
    const url = `/MyCourses/QuizInterface/PreviewQuiz?id=${id}`;
    navigate(url);
  }

  useEffect(() => {
    fetch(`http://localhost:8080/api/quiz_attempt/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuesInQuizList(data.quesInQuizList);
      });
  }, [id]);

  return (
    <div className="confirm-page">
      <h2>Summary of attempt</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {quesInQuizList.map((quesInQuiz, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              <td>{quesInQuiz.idInQuiz}</td>
              <td>
                {quesInQuiz.choiceChosen.includes(1)
                  ? "Completed"
                  : "Not Complete"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button className="return-btn" onClick={handleReturn}>
          Return to attempt
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit all and finish
        </button>
      </div>
    </div>
  );
};

export default ConfirmFinish;
