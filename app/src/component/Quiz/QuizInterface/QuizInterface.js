import React, { useEffect, useState } from "react";
import "./QuizInterface.css";
import { AiFillSetting } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link} from "react-router-dom";

const QuizInterface = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questionsID, setQuestionsID] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeOpen, setTimeOpen] = useState(""); // Default value
  const [timeClose, setTimeClose] = useState(""); // Default value
  const [quizAttemptID, setQuizAttemptID] = useState([]);
  const [quizState, setQuizState] = useState(null);
  const [ongoingAttempt, setOngoingAttempt] = useState(false);
  const [quizMaxGrade, setQuizMaxGrade] = useState(0.0);
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const navigate = useNavigate();

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
        setTimeLimit(quiz.timeLimit);
        setQuizAttemptID(quiz.quizAttemptID);
        setQuizState(quiz.quizState);
        setOngoingAttempt(quiz.ongoingAttempt);
        setQuizMaxGrade(quiz.quizMaxGrade);
        // Update other state variables with quiz data as needed
      })
      .catch((error) => {
        // Handle errors if quiz data cannot be loaded
      });
  }, [id]);

  function toEditingQuiz() {
    return (
      <Link to={`/MyCourses/QuizInterface/EditingQuiz?id=${id}`}>
        <AiFillSetting />
      </Link>
    );
  }

  const handleStartAttempt = () => {
    const data = {
      quizID: id,
      //Thêm các thuộc tính khác nếu cần
    };

    fetch("http://localhost:8080/api/quiz_attempt?"
      +new URLSearchParams({
        shuffle_option: true
    })
    , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 405) {
            console.log('Method not allowed error');
            alert(await response.text());
          }
          throw new Error("Network response was not ok");
        }
        return response.json(); // Chuyển đổi response body thành object JSON
      })
      .then((data) => {
        //lấy id của quiz attempt vừa post
        const { id } = data; // Trích xuất giá trị id từ response object
        const url = `/MyCourses/QuizInterface/PreviewQuiz?id=${id}`;
        navigate(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };  

  const handleCancel = () => {
    setShowPreviewPopup(false);
  };

  return (
    <div className={`wrapper ${showPreviewPopup ? 'showPopup' : ''}`}>
      <div className="QuizInterface">
      <p className="quizName">{name}</p>
      <div className="editIcon">{toEditingQuiz(id)}</div>
      <div className="line2">
        <p>Time limit: {timeLimit} minutes</p>
        <p>Grading method: Last attempt</p>
      </div>

      <p className="caption">Summary of your previous attempts</p>

      <table className="table">
        <thead>
          <tr>
            <th>Attempt</th>
            <th>State</th>
          </tr>
        </thead>
        <tr>
          <td>Preview</td>
          <td>Never submited</td>
        </tr>
      </table>

      <button
        className="previewQuizButton"
        onClick={() => setShowPreviewPopup(true)}
      >
        Preview quiz now
      </button>
      {showPreviewPopup && (
        <div className="PreviewPopup">
          <div className="popup_header">
            <button className="closeButton" onClick={handleCancel}>
              x
            </button>
            <h2>Start attempt</h2>
          </div>
          <div className="popup_body">
            <h4>Time limit</h4>
            <p>
              Your attempt will have a time limit {timeLimit} minutes. When you start, the
              timer will begin to count down and cannot be paused. You must
              finish your attempt before it expires. Are you sure you wish to
              start now?
            </p>
          </div>
          <div className="popup_footer">
            <button className="startattempt_btn" onClick={handleStartAttempt}>
            START ATTEMPT
          </button>
          <button className="cancel_btn" onClick={handleCancel}>
            CANCEL
          </button>
          </div>
          
        </div>
      )}
    </div>
    </div>
    
  );
};

export default QuizInterface;
