import React from 'react'
import { useState } from 'react';
import { NavLink } from 'react-router-dom'
import { AiOutlineFileDone } from 'react-icons/ai'
import './MyCourse.css';
const MyCourses = () => {
  // tạo list quiz chung
  const [quizs, setQuizs] = useState([
    {
      "id": 1,
      "name": "QUIZ1",
      "description": "kbsajgs",
      "questionsID": [],
      "timeLimitDay": 0,
      "timeOpen": null,
      "timeClose": null,
      "quizAttemp": null,
      "quizState": null,
      "quizMaxGrade": 0.0
    },
    {
      "id": 2,
      "name": "QUIZ2",
      "description": "kbsajgs",
      "questionsID": [],
      "timeLimitDay": 0,
      "timeOpen": null,
      "timeClose": null,
      "quizAttemp": null,
      "quizState": null,
      "quizMaxGrade": 0.0
    },
    {
      "id": 3,
      "name": "QUIZ3",
      "description": "kbsajgs",
      "questionsID": [],
      "timeLimitDay": 0,
      "timeOpen": null,
      "timeClose": null,
      "quizAttemp": null,
      "quizState": null,
      "quizMaxGrade": 0.0
    },
    {
      "id": 4,
      "name": "QUIZ4",
      "description": "kbsajgs",
      "questionsID": [],
      "timeLimitDay": 0,
      "timeOpen": null,
      "timeClose": null,
      "quizAttemp": null,
      "quizState": null,
      "quizMaxGrade": 0.0
    }
  ]);
  return (
    <div className='MyCourse'>
      {quizs.map(quiz => (
        <NavLink to={`/MyCourse/${quiz.name}`}>
          <p className='listquizs'> <AiOutlineFileDone /> {quiz.name}</p>
        </NavLink>
      ))}

    </div>

  )
}

export default MyCourses