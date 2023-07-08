import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineFileDone } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs'
import './MyCourse.css';

const MyCourses = () => {
  const [quizs, setQuizs] = useState([]);

  // Fetch the quiz list from the server on component mount
  useEffect(() => {
    const fetchQuizs = async () => {
      try
      {
        const response = await fetch("http://localhost:8080/api/quizzes");
        const data = await response.json();
        if (response.ok)
        {
          setQuizs(data);
        } else
        {
          alert("An error occurred.");
        }
      } catch (error)
      {
        console.error("Error while fetching quiz list", error);
        alert("Error while fetching quiz list");
      }
    };
    fetchQuizs();
  }, []);

  const handleDeleteQuiz = async (id) => {
    try
    {
      const response = await fetch(`http://localhost:8080/api/quiz/${id}`, {
        method: 'DELETE'
      });
      if (response.ok)
      {
        setQuizs(quizs.filter((quiz) => quiz.id !== id));
      } else
      {
        alert("An error occurred.");
      }
    } catch (error)
    {
      console.error("Error while deleting quiz", error);
      alert("Error while deleting quiz");
    }
  };

  const navigate = useNavigate();

  function QuizLink(quiz) {
    return <Link to={`/MyCourses/QuizInterface?id=${quiz.id}`}>{quiz.name}</Link>;
  }

  return (
    <div className="MyCourse">
      {quizs.map((quiz) => (
        <div key={quiz.id}>
          <p className="listquizs">
            <AiOutlineFileDone />
            <QuizLink id={quiz.id} name={quiz.name} />
            <BsFillTrash3Fill
              className="trash-icon"
              onClick={() => handleDeleteQuiz(quiz.id)}
            />
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyCourses;