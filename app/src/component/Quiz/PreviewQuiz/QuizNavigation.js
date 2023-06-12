import React, { useState, useEffect } from "react";
import "./PreviewQuiz.css";

function QuizNavigation({ quesInQuizList, handleNavClick, selectedQuizId, handleFinishAttempt}) {
  return (
    <div className="quiz-navigation-box">
    <div className="navigation-header">
      <h5>Quiz Navigation</h5>
    </div>
    <div className="quiz-navigation">
      {quesInQuizList.map((quesInQuiz) => (
        <div
          key={quesInQuiz.idInQuiz}
          className={`quiz-nav-item ${
            quesInQuiz.choiceChosen.filter((value) => value === 1).length > 0 ? "answered" : ""
          } ${quesInQuiz.idInQuiz === selectedQuizId ? "selected" : ""}`}
          onClick={() => handleNavClick(quesInQuiz.idInQuiz)}
        >
          {quesInQuiz.idInQuiz}
        </div>
      ))}
    </div>
    <button onClick={handleFinishAttempt}>Finish Attempt</button>
    </div>
    
  );
}

export default QuizNavigation;
