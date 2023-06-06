import React, { useEffect, useState, useRef } from 'react';
import './EditingQuiz.css'
import { AiFillSetting } from 'react-icons/ai'
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link } from 'react-router-dom';
import { MdArrowDropDown } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi'
import {HiPlusSm} from 'react-icons/hi'

const QuizInterface = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questionsID, setQuestionsID] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeOpen, setTimeOpen] = useState(null); // Default value
  const [timeClose, setTimeClose] = useState(null); // Default value
  const [quizAttemptID, setQuizAttemptID] = useState([]);
  const [quizState, setQuizState] = useState(null)
  const [ongoingAttempt, setOngoingAttempt] = useState(false);
  const [quizMaxGrade, setQuizMaxGrade] = useState(0.0);
  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [quizs, setQuizs] = useState([]);
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target))
    {
      setDropdownVisibility(false);
    }
  };

  const handleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  const handleHover = (value) => {
    setHovered(value);
  };

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

  return (
    <div className='QuizInterface'>
      <p className='quizName'>Editing Quiz: {name}</p>
      <div className='inforQuiz'>
        <div className='numberOfQs'>Question: 0 </div>
        <div className='onGoingAttempt'> | </div>
        <div className='onGoingAttempt'>{(ongoingAttempt) ? ' This quiz is open' : ' This quiz is close'}</div>
        <div className='maxgrade'>Maximum grade: <input type='number'></input>
          <button>save</button>
        </div>
      </div>
      <p className='totalMark'>Total of mark: 0.00</p>
      <div className='btn'>
        <button className='REPAGINATEButton'>REPAGINATE</button>
        <button className='SELECTMULTIPLEITEMSButton'>SELECT MULTIPLEITEMS</button>

      </div>
      <div className='shuffle'><input type='checkbox' ></input> Shuffle</div>
      <div className='dropdown-container1' onMouseLeave={() => handleDropdown(false)}>
        <div className='add-button1' onClick={() => handleDropdown(!isDropdownVisible)}>Add <MdArrowDropDown/></div>
        {isDropdownVisible && (
          <div
            className='dropdown-menu1'
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            <div> <HiPlusSm /> add new question </div>
            <div className='dropdownQS'>
              <NavLink to='/QuestionBank'><BiPlus style={{color:"rgb(71, 137, 237)", paddingTop:"5px"}}/> from question bank</NavLink>
            </div>
            <div className='dropdownQS'>
              <NavLink to='/RandomQuestion'><BiPlus style={{ color: "rgb(71, 137, 237)", paddingTop: "5px" }} /> a random question</NavLink>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default QuizInterface;
