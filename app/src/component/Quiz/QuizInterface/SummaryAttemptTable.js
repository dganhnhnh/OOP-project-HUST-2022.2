import React, { useState, useEffect } from 'react';

const SummaryAttemptTable = ({ quizAttemptID, ongoingAttempt }) => {
  const [attemptData, setAttemptData] = useState([]);

  useEffect(() => {
    Promise.all(
      quizAttemptID.map(attemptID =>
        fetch(`http://localhost:8080/api/quiz_attempt/${attemptID}`)
          .then(response => response.json())
      )
    ).then(data => {
      setAttemptData(data);
      console.log(data)
    });
  }, []);

  return (
    <table className="summary_attempt_table">
      <thead>
        <tr>
          <th>Attempt</th>
          <th>State</th>
          <th>Grade / 10</th>
          <th>Review</th>
        </tr>
      </thead>
      <tbody>
        {attemptData.map((attempt, index) => {
          const attemptNumber = index + 1;
          const { timeComplete, totalMark } = attempt;
          const ongoing = ongoingAttempt;
          const state = ongoing ? 'In progress' : `Finished Submitted ${timeComplete}`;
          const grade = ongoing ? '' : totalMark;
          const reviewURL = `/MyCourses/QuizInterface/PreviewQuiz/QuizResult?id=${attempt.quizAttemptID}`;

          return (
            <tr key={attempt.quizAttemptID}>
              <td>{attemptNumber}</td>
              <td>{state}</td>
              <td>{grade}</td>
              <td>
                <a href={reviewURL}>
                  Review
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default SummaryAttemptTable;