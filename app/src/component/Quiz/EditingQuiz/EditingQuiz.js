import React, { useEffect, useState, useRef, useContext } from "react";
import "./EditingQuiz.css";
import { renderMatches, useLocation, useNavigate } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { BsFillTrash3Fill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import { HiPlusSm } from "react-icons/hi";
import { decode } from "html-entities";
import { SlMagnifierAdd } from "react-icons/sl";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TiPlus } from "react-icons/ti";

const EditingQuiz = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questionsID, setQuestionsID] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeOpen, setTimeOpen] = useState(null); // Default value
  const [timeClose, setTimeClose] = useState(null); // Default value
  const [quizAttemptID, setQuizAttemptID] = useState([]);
  const [quizState, setQuizState] = useState(null);
  const [ongoingAttempt, setOngoingAttempt] = useState(false);
  const [quizMaxGrade, setQuizMaxGrade] = useState(0.0);
  const [questions, setQuestions] = useState([]); // Define the questions state variable
  const [deleteQuestions, setDeleteQuestions] = useState([]);
  const [isSelectedMultipleItems, setIsSelectedMultipleItems] = useState(false);
  const [checkedQuestionIds, setCheckedQuestionIds] = useState([]);

  const [shuffleOption, setShuffleOption] = useState(false);    //load shuffle option from db to here 
  // Fetch the list of questions from the backend API
  useEffect(() => {
    fetch(`http://localhost:8080/api/questions`)
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => {
        // Handle errors if questions data cannot be loaded
      });
  }, []);

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
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
        setTimeLimit(quiz.timeLimit);
        setQuizAttemptID(quiz.quizAttemptID);
        setQuizState(quiz.quizState);
        setOngoingAttempt(quiz.ongoingAttempt);
        setQuizMaxGrade(quiz.quizMaxGrade);
        setQuestionsID(quiz.questionsID);
        // Update other state variables with quiz data as needed
        setShuffleOption(quiz.shuffle);
      })
      .catch((error) => {
        // Handle errors if quiz data cannot be loaded
      });
  }, [id]);

  const updateMaxGrade = (e) => {
    e.preventDefault();
    console.log("ID:", id);
    console.log("Max grade:", quizMaxGrade);
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {
        quiz.quizMaxGrade = quizMaxGrade;
        return fetch(`http://localhost:8080/api/quiz/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quiz), // Include the updated quiz object in the request body
        });
      })
      .then((response) => {
        console.log("Response:", response);
        if (response.ok) {
          console.log("Quiz updated successfully");
        } else {
          throw new Error("Failed to update quiz");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteQuestion = (questionID) => {
    fetch(`http://localhost:8080/api/quiz/${id}/questions/${questionID}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestionsID(data.questionsID); // update the questionsID state with the updated list
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleShuffle = (event) => {
    setShuffleOption(event.target.checked);

    // save change to Quiz in db

    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {

        const updatedQuiz = { ...quiz, shuffle: shuffleOption };
        return fetch(`http://localhost:8080/api/quiz/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuiz),
        });
      })


      // fetch(`http://localhost:8080/api/quiz/${id}/`, {
      //   method: "PUT",
      //   body: JSON.stringify(updatedQuiz),
      // })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error shuffle:", error);
      });
  };

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedQuestionIds([...checkedQuestionIds, id]);
    } else {
      setCheckedQuestionIds(
        checkedQuestionIds.filter((checkedId) => checkedId !== id)
      );
    }

    const updatedQuestions = questions.map((question) => {
      if (question.id === id) {
        return {
          ...question,
          checked: isChecked,
        };
      }
      return question;
    });

    setDeleteQuestions(updatedQuestions.filter((question) => question.checked));
  };

  const handleDeleteSelectedQuestions = () => {
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {
        const existingQuestions = quiz.questionsID || [];
        const deletedQuestionIds = checkedQuestionIds;
        const filteredExistingQuestionIds = existingQuestions.filter(
          (id) => !deletedQuestionIds.includes(id)
        );
        const updatedQuestions = [...filteredExistingQuestionIds];

        const updatedQuiz = { ...quiz, questionsID: updatedQuestions };

        return fetch(`http://localhost:8080/api/quiz/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuiz),
        });
      })
      .then((response) => {
        if (response.ok) {
          console.log("Quiz updated successfully");
          const updatedQuestions = questions.filter((question) => {
            return !checkedQuestionIds.includes(question.id);
          });
          setQuestions(updatedQuestions);
          setDeleteQuestions([]);
        } else {
          throw new Error("Failed to update quiz");
        }
      })
      .catch((error) => console.error(error)); // TODO: handle error appropriately
  };

  const QuestionBankLink = ({ id }) => {
    return (
      <Link to={`/MyCourses/QuizInterface/EditingQuiz/QuestionBank?id=${id}`}>
        <BiPlus style={{ color: "rgb(71, 137, 237)", paddingTop: "5px" }} />
        <span> from question bank</span>
      </Link>
    );
  };

  const QuestionRandomLink = ({ id }) => {
    return (
      <Link to={`/MyCourses/QuizInterface/EditingQuiz/ExistingCategory?id=${id}`}>
        <BiPlus style={{ color: "rgb(71, 137, 237)", paddingTop: "5px" }} />
        <span> a random question</span>
      </Link>
    );
  };

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.defaultMark,
    0
  );
  return (
    <div className="QuizInterface">
      <p className="quizName">Editing Quiz: {name}</p>
      <div className="inforQuiz">
        <div className="numberOfQs">Question: 0 </div>
        <div className="onGoingAttempt"> | </div>
        <div className="onGoingAttempt">
          {ongoingAttempt ? " This quiz is open" : " This quiz is close"}
        </div>
        <div className="maxgrade">
          Maximum grade:
          <input
            type="number"
            onChange={(e) => {
              console.log(parseFloat(e.target.value));
              setQuizMaxGrade(parseFloat(e.target.value));
            }}
          ></input>
          {/* Use parseFloat to convert input to a float */}
          <button className="btnSaveMaxGrade" onClick={updateMaxGrade}>
            save
          </button>{" "}
          {/* Use parseFloat to convert input to a float and prevent default button behavior */}
        </div>
      </div>
      <p className="totalMark">Total of mark: {totalMarks}.00</p>
      <div className="btn">
        <button className="REPAGINATEButton">REPAGINATE</button>
        <button
          className="SELECTMULTIPLEITEMSButton"
          onClick={() => setIsSelectedMultipleItems(!isSelectedMultipleItems)}
        >
          SELECT MULTIPLEITEMS
        </button>
      </div>
      <div className="shuffle">
        <input type="checkbox" checked={shuffleOption} onChange={handleShuffle}></input> Shuffle
      </div>
      <div
        className="dropdown-container1"
        onMouseLeave={() => handleDropdown(false)}
      >
        <div
          className="add-button1"
          onClick={() => handleDropdown(!isDropdownVisible)}
        >
          Add <MdArrowDropDown />
        </div>
        {isDropdownVisible && (
          <div
            className="dropdown-menu1"
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            <div>
              {" "}
              <HiPlusSm /> add new question{" "}
            </div>
            <div className="dropdownQS">
              <QuestionBankLink id={id}></QuestionBankLink>
            </div>
            <div className="dropdownQS">
              <QuestionRandomLink id={id}></QuestionRandomLink>
            </div>
          </div>
        )}
      </div>
      {/* hIỆN RA CÂU HỎI */}
      <div style={{ height: "600px", overflow: "auto" }}>
        {isSelectedMultipleItems &&
          questionsID.map((questionID) => {
            const question = questions.find(
              (question) => question.id === questionID
            );
            if (!question) {
              return (
                <div key={questionID}>
                  {" "}
                  Question not found for ID: {questionID}{" "}
                </div>
              );
            }
            const plainText = decode(question.text).replace(/<[^>]+>/g, "");
            const displayText =
              plainText.length > 50
                ? plainText.slice(0, 50) + "..."
                : plainText;
            return (
              <div key={questionID} className="question-row">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TiPlus
                    style={{ marginTop: "0px", color: "rgb(8, 79, 123)" }}
                  />
                  <input
                    type="checkbox"
                    style={{ marginTop: "0px", marginRight: "5px" }}
                    checked={question.checked}
                    onChange={(event) =>
                      handleCheckboxChange(event, question.id)
                    }
                  />
                  <AiOutlineUnorderedList
                    style={{ marginTop: "0px", marginRight: "20px" }}
                  />
                  <div
                    className="question-name"
                    style={{ fontSize: "17px", marginTop: "0px" }}
                  >
                    {displayText}
                  </div>
                </div>

                <div className="action-btns1"></div>

                <div className="question-delete">
                  <SlMagnifierAdd style={{ color: "rgb(31, 130, 201)" }} />
                  <BsFillTrash3Fill
                    style={{ marginRight: "20px", cursor: "pointer" }}
                    onClick={() => handleDeleteQuestion(question.id)}
                  />
                  <div className="boxDefaultMark">
                    {question.defaultMark}
                    <BsFillPencilFill style={{ marginLeft: "20px" }} />
                  </div>
                </div>
              </div>
            );
          })}

        {!isSelectedMultipleItems &&
          questionsID.map((questionID) => {
            const question = questions.find(
              (question) => question.id === questionID
            );
            if (!question) {
              return (
                <div key={questionID}>
                  {" "}
                  Question not found for ID: {questionID}{" "}
                </div>
              );
            }
            const plainText = decode(question.text).replace(/<[^>]+>/g, "");
            const displayText =
              plainText.length > 50
                ? plainText.slice(0, 50) + "..."
                : plainText;
            return (
              <div key={questionID} className="question-row">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TiPlus
                    style={{ marginTop: "0px", color: "rgb(8, 79, 123)" }}
                  />
                  <AiOutlineUnorderedList
                    style={{ marginTop: "0px", marginRight: "20px" }}
                  />
                  <div
                    className="question-name"
                    style={{ fontSize: "17px", marginTop: "0px" }}
                  >
                    {displayText}
                  </div>
                </div>

                <div className="action-btns1"></div>

                <div className="question-delete">
                  <SlMagnifierAdd style={{ color: "rgb(31, 130, 201)" }} />
                  <BsFillTrash3Fill
                    style={{ marginRight: "20px", cursor: "pointer" }}
                    onClick={() => handleDeleteQuestion(question.id)}
                  />
                  <div className="boxDefaultMark">
                    {question.defaultMark}
                    <BsFillPencilFill style={{ marginLeft: "20px" }} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {deleteQuestions.length > 0 && (
        <div className="btnDeleteMultiple">
          <button
            className="deleteButton"
            onClick={handleDeleteSelectedQuestions}
          >
            DELETE ALL SELECTED QUESTION
          </button>
        </div>
      )}
    </div>
  );
};

export default EditingQuiz;
