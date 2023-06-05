import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineFileDone } from 'react-icons/ai';
import './MyCourse.css';

const MyCourses = () => {
  const [quizs, setQuizs] = useState([]);

  // Fetch the quiz list from the server on component mount
  useEffect(() => {
    const fetchQuizs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/quizzes");
        const data = await response.json();
        if (response.ok) {
          setQuizs(data);
        } else {
          alert("An error occurred.");
        }
      } catch (error) {
        console.error("Error while fetching quiz list", error);
        alert("Error while fetching quiz list");
      }
    };
    fetchQuizs();
  }, []);

  return (
    <div className='MyCourse'>
      {quizs.map(quiz => (
        <NavLink key={quiz._id} to={`/MyCourse/${quiz.name}`}>
          <p className='listquizs'> <AiOutlineFileDone /> {quiz.name}</p>
        </NavLink>
      ))}

    </div>
  );
};

export default MyCourses;