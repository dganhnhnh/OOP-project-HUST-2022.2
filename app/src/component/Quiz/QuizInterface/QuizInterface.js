import React, { useEffect, useState} from "react";
import "./QuizInterface.css";
import { AiFillSetting } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";

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
  const [attemptData, setAttemptData] = useState([]);
  // shuffle
  const [shuffle, setShuffle] = useState(false);
 
  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {
        setName(quiz.name);
        setDescription(quiz.description);
        setTimeOpen(quiz.timeOpen);
        setTimeClose(quiz.timeClose);
        setTimeLimit(quiz.timeLimit);
        setQuizAttemptID(quiz.quizAttemptID);
        setQuizState(quiz.quizState);
        setOngoingAttempt(quiz.ongoingAttempt);
        setQuizMaxGrade(quiz.quizMaxGrade);
        setShuffle(quiz.shuffle);

        const fetchAttemptData = quiz.quizAttemptID.map((attemptID) =>
          fetch(`http://localhost:8080/api/quiz_attempt/${attemptID}`).then(
            (response) => response.json()
          )
        );

        Promise.all(fetchAttemptData)
          .then((data) => {
            setAttemptData(data);
            //resolve all promise, tạo thành array chứa các attempt data 
            console.log(data);
          })
          .catch((error) => {
            // Handle errors if quiz_attempt data cannot be loaded
          });
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
        shuffle_option: shuffle
    })
    ,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 405) {
            console.log("Method not allowed error");
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

  const handleContinueQuizButton = () => {
    const lastQuizAttemptID = quizAttemptID[quizAttemptID.length - 1];
    const url = `/MyCourses/QuizInterface/PreviewQuiz?id=${lastQuizAttemptID}`;
    navigate(url);
  };

  function formatDate(dateString) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  }

  const handleExport = () => {
    const password = prompt("Enter password for PDF export:");
  
    if (password) {
      const exportURL = `http://localhost:8080/api/quiz_attempt/${quizAttemptID[quizAttemptID.length - 1]}/ExportToPDF?password=${password}`;
      window.open(exportURL);
    }
  };

  return (
      <div className={`wrapper ${showPreviewPopup ? "showPopup" : ""}`}>
      <div className="QuizInterface">
        <p className="quizName">{name}</p>
        <div className="editIcon">{toEditingQuiz(id)}</div>
        <div className="line2">
          <p>Time open: {timeOpen}</p>
          <p>Time close: {timeClose}</p>
          <p>Time limit: {timeLimit} minutes</p>
          <p>Grading method: Last attempt</p>
        </div>

        <p className="caption">Summary of your previous attempts</p>

        <table className="summary_attempt_table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>State</th>
              <th>Grade / 10.00</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {attemptData.map((attempt, index) => {
              const attemptNumber = index + 1;
              const { timeComplete, totalMark } = attempt;
              let ongoing = !attempt.finished;
              const state = ongoing
                ? "In progress"
                : `Submitted ${formatDate(timeComplete)}`;
              let quizMarkGrade = 0;
              attempt.quesInQuizList.forEach((quesInQuiz) => {
                quesInQuiz.choiceGrade.forEach((choice) => {
                  quizMarkGrade += choice;
                });
              });
              const grade = ongoing ? "" : ((10 / quizMarkGrade) * totalMark).toFixed(2);
              const reviewURL = `/MyCourses/QuizInterface/PreviewQuiz/QuizResult?id=${attempt.id}`;
              return (
                <tr key={attempt.id}>
                  <td>{attemptNumber}</td>
                  <td>{state}</td>
                  <td>{grade}</td>
                  <td>
                    <a href={reviewURL}>{ongoing ? "" : "Review"}</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ongoingAttempt ? (
          <button
            className="continueQuizButton"
            onClick={() => handleContinueQuizButton()}
          >
            Continue preview quiz
          </button>
        ) : (
          <button
            className="previewQuizButton"
            onClick={() => setShowPreviewPopup(true)}
          >
            Preview quiz now
          </button>
        )}
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
                Your attempt will have a time limit {timeLimit} minutes. When
                you start, the timer will begin to count down and cannot be
                paused. You must finish your attempt before it expires. Are you
                sure you wish to start now?
              </p>
            </div>
            <div className="popup_footer">
              <button className="startattempt_btn" onClick={handleStartAttempt}>
                START ATTEMPT
              </button>
              <button className="cancel_btn" onClick={handleCancel}>
                CANCEL
              </button>
              <button className="export_btn" onClick={handleExport}>EXPORT</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
