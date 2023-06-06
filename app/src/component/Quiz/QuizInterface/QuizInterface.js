import React, { useEffect, useState } from 'react';
import './QuizInterface.css'
import { AiFillSetting } from 'react-icons/ai'
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link } from 'react-router-dom';
const QuizInterface = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [numberTime, setNumberTime] = useState("");
  // const [time, setTime] = useState('');
  const [questionsID, setQuestionsID] = useState([]);
  const [timeLimitDay] = useState(0);
  const [timeOpen, setTimeOpen] = useState(null); // Default value
  const [timeClose, setTimeClose] = useState(null); // Default value
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [ongoingAttempt, setOngoingAttempt] = useState(false);
  const [quizMaxGrade, setQuizMaxGrade] = useState(0.0);
  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [quizs, setQuizs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {
        setName(quiz.name);
        setDescription(quiz.description);
        // Update other state variables with quiz data as needed
      })
      .catch((error) => {
        // Handle errors if quiz data cannot be loaded
      });
  }, [id]);

  function toEditingQuiz() {
    return <Link to={`/EditingQuiz?id=${id}`}><AiFillSetting /></Link>;
  }

  return (
    <div className='QuizInterface'>
      <p className='quizName'>{name}</p>
      <div className='editIcon'>{toEditingQuiz(id)}</div>
      <div className='line2'>
        <p>Time limit: </p>
        <p>Grading method: Last attempt</p>
      </div>

      <p className='caption'>Summary of your previous attempts</p>

      <table className='table'>
        <thead>
          <tr >
            <th>Attempt</th>
            <th>State</th>
          </tr>
        </thead>
        <tr>
          <td>1</td>
          <td>Mặt hàng A</td>

        </tr>


      </table>

      <button className='previewQuizButton'>Preview quiz now</button>

    </div>
  );
};

export default QuizInterface;
