import React, { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import "./PreviewQuiz.css";

function QuizNavigation({ quesInQuizList, handleNavClick, selectedQuizId, ongoingAttempt, id}) {
  const navigate = useNavigate();

  function handleFinishAttempt(){
    const url = `/MyCourses/QuizInterface/PreviewQuiz/ConfirmFinish?id=${id}`;
    navigate(url);
  }

  function handleFinishReview(){
    const url = `/MyCourses`;
    navigate(url);
  }

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
    {ongoingAttempt ? (
          <button
            onClick={() => handleFinishAttempt()}
          >
            Finish Attempt
          </button>
        ) : (
          <button
            onClick={() => handleFinishReview()}
          >
            Finish Review
          </button>
        )}
    </div>
    
  );
}

export default QuizNavigation;
