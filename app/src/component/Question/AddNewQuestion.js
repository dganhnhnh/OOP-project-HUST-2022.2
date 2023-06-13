import React, { useState, useEffect } from "react";
import "./EditQuestion.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import ChoiceField from "./ChoiceField";
import MyEditor from "./MyEditor";
import SelectCategory from "../Category/SelectCategory";

const AddNewQuestion = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [defaultMark, setDefaultMark] = useState(0);
  const [showAdditionalChoices, setShowAdditionalChoices] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});

  const [choice1, setChoice1] = useState("");
  const [choice1Grade, setChoice1Grade] = useState(0);

  const [choice2, setChoice2] = useState("");
  const [choice2Grade, setChoice2Grade] = useState(0);

  const [choice3, setChoice3] = useState("");
  const [choice3Grade, setChoice3Grade] = useState(0);

  const [choice4, setChoice4] = useState("");
  const [choice4Grade, setChoice4Grade] = useState(0);

  const [choice5, setChoice5] = useState("");
  const [choice5Grade, setChoice5Grade] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSaveAndContinueEditing = (event) => {
    event.preventDefault();
    // Tạo một đối tượng question mới từ các giá trị nhập vào form
    const newQuestion = {
      name: name,
      text: text,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };

    if (choice1) {
      newQuestion.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
      });
    }

    if (choice2) {
      newQuestion.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
      });
    }

    if (choice3) {
      newQuestion.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
      });
    }

    if (choice4) {
      newQuestion.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
      });
    }

    if (choice5) {
      newQuestion.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
      });
    }

    console.log(newQuestion);
    // Gọi API để tạo mới question
    fetch("http://localhost:8080/api/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Question saved!");
        // Điều hướng đến trang editing mới cho question vừa tạo, với ID được trả về từ API
        navigate(`/MyCourses/Question/EditQuestion?id=${data.id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();
    // Tạo một đối tượng question mới từ các giá trị nhập vào form
    const newQuestion = {
      name: name,
      text: text,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };

    if (choice1)
    {
      newQuestion.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
      });
    }

    if (choice2) {
      newQuestion.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
      });
    }

    if (choice3) {
      newQuestion.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
      });
    }

    if (choice4) {
      newQuestion.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
      });
    }

    if (choice5) {
      newQuestion.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
      });
    }

    // Gọi API để tạo mới question
    fetch("http://localhost:8080/api/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        console.log(JSON.stringify(newQuestion));
        alert("Question saved!");
        navigate(`/MyCourses/Question`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCancel = () => {
    navigate("/MyCourses/Question");
  };

  return (
    <div className="edit-question">
      <h1> Adding a Mutiple choice question</h1>
      <h5>
        <FaChevronDown style={{ color: "blue" }} /> General{" "}
      </h5>

      <div className="row">
        <div className="col-40">
          <p>Category</p>
        </div>
        <div className="col-60">
        <SelectCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setCategories={setCategories}
          questionsByCategory={questionsByCategory}
          setQuestionsByCategory={setQuestionsByCategory}
        />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-40">
            <label>Question name</label>
          </div>
          <div className="col-60">
            <input
              className="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-40">
            <label>Question text</label>
          </div>
          <div className="col-60">
            <MyEditor
              text={text}
              setText={setText}
              // text và setText này là thao tác trên Question JSON
            />
          </div>
        </div>

        <div className="row">
          <div className="col-40">
            <label>Default mark</label>
          </div>
          <div className="col-60">
            <input
              className="mark"
              type="number"
              value={defaultMark}
              onChange={(event) => setDefaultMark(parseInt(event.target.value))}
            />
          </div>
        </div>

        <div className="choice">
          <ChoiceField
            label="Choice 1"
            text={choice1}
            setText={setChoice1}
            grade={choice1Grade}
            setGrade={setChoice1Grade}
          />
        </div>

        <div className="choice">
          <ChoiceField
            label="Choice 2"
            text={choice2}
            setText={setChoice2}
            grade={choice2Grade}
            setGrade={setChoice2Grade}
          />
        </div>

        {showAdditionalChoices && (
          <>
            <div className="choice">
              <ChoiceField
                label="Choice 3"
                text={choice3}
                setText={setChoice3}
                grade={choice3Grade}
                setGrade={setChoice3Grade}
              />
            </div>

            <div className="choice">
              <ChoiceField
                label="Choice 4"
                text={choice4}
                setText={setChoice4}
                grade={choice4Grade}
                setGrade={setChoice4Grade}
              />
            </div>

            <div className="choice">
              <ChoiceField
                label="Choice 5"
                text={choice5}
                setText={setChoice5}
                grade={choice5Grade}
                setGrade={setChoice5Grade}
              />
            </div>
          </>
        )}

        <div className="button-in-editing">
          <button
            className="button-1"
            onClick={() => setShowAdditionalChoices(!showAdditionalChoices)}
          >
            BLANKS FOR 3 MORE CHOICES
          </button>

          <button
            className="button-2"
            type="submit"
            onClick={handleSaveAndContinueEditing}
          >
            SAVE CHANGES AND CONTINUE EDITING
          </button>

          <div className="button-group button34">
            <button
              className="button-3"
              type="submit"
              onClick={handleSaveChanges}
            >
              SAVE CHANGES
            </button>

            <button className="button-4" onClick={handleCancel}>
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewQuestion;
