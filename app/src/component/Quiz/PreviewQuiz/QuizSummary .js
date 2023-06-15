import React, { useEffect, useState } from 'react';

const QuizSummary = ({ id }) => {
  const [quizAttempt, setQuizAttempt] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/quiz_attempt/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizAttempt(data);
        console.log(quizAttempt);
      });
  }, [id]);

  if (!quizAttempt) {
    return <div>Loading...</div>;
  }

  const {
    timeStart,
    timeComplete,
    totalMark,
    timeTaken,
  } = quizAttempt;

  // Tính toán thời gian đã mất
  const hours = Math.floor(timeTaken / 3600);
  const minutes = Math.floor((timeTaken % 3600) / 60);
  const seconds = timeTaken % 60;

//chuyển về dạng thứ, ngày tháng năm, hh:mm AM/PM
  function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

    let quizMarkGrade = 0;
    quizAttempt.quesInQuizList.forEach((quesInQuiz) => {
      quesInQuiz.choiceGrade.forEach((choice) => {
        quizMarkGrade += choice;
      });
    });
  
    const gradePercentage = (totalMark / quizMarkGrade) * 100;
    const grade = (10/quizMarkGrade) * totalMark;
  return (
    <div className="quiz-summary">
      <table>
        <tbody>
          <tr  className="gray-row">
            <td className="column1">Started on</td>
            <td>{formatDate(timeStart)}</td>
          </tr>
          <tr>
            <td className="column1">State</td>
            <td>Finished</td>
          </tr>
          <tr className="gray-row">
            <td className="column1">Completed on</td>
            <td>{formatDate(timeComplete)}</td>
          </tr>
          <tr>
            <td className="column1">Time taken</td>
            <td>{`${hours} hours ${minutes} mins ${seconds} secs`}</td>
          </tr>
          <tr className="gray-row">
            <td className="column1">Marks</td>
            <td>{`${totalMark}/${quizMarkGrade}`}</td>
          </tr>
          <tr>
            <td className="column1">Grade</td>
            <td><b>{grade.toFixed(2)}</b> out of 10.00 (<b>{gradePercentage.toFixed(2)}</b>%)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default QuizSummary;
