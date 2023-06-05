import React from 'react';

const QuizInterface = ({ quiz }) => {
  const { name, description, questionsID, timeLimitDay, timeOpen, timeClose, quizMaxGrade } = quiz;

  return (
    <article>
      <div className="line1">
        <h3>{name}</h3>
      </div>
      <div className="line2">
        <p>Description: {description}</p>
        <p>Number of Questions: {questionsID.length}</p>
        <p>Time Limit (Days): {timeLimitDay}</p>
      </div>
      <div className="line3">
        <p>Time Open: {timeOpen}</p>
        <p>Time Close: {timeClose}</p>
        <p>Max Grade: {quizMaxGrade}</p>
      </div>
      {/* Additional quiz content, such as questions and answers */}
    </article>
  );
};

export default QuizInterface;
