import React, { useState, useEffect } from "react";
import "./EditQuestion.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import ChoiceField from "./ChoiceField";
import MyEditor from "./MyEditor";
import SelectCategory from "../Category/SelectCategory";

const EditQuestion = () => {
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

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    // gửi yêu cầu API để tải câu hỏi đã chọn từ máy chủ
    fetch(`http://localhost:8080/api/question/${id}`)
      .then((response) => response.json())
      .then((question) => {
        // set giá trị mặc định cho các input field
        console.log(question);
        setSelectedCategory(question.categoryID);
        setName(question.name);
        setText(question.text);
        setDefaultMark(question.defaultMark);

        setChoice1(question.choices[0].choiceText);
        setChoice1Grade(question.choices[0].grade);

        setChoice2(question.choices[1].choiceText);
        setChoice2Grade(question.choices[1].grade);

        setChoice3(question.choices[2].choiceText);
        setChoice3Grade(question.choices[2].grade);
 
        setChoice4(question.choices[3].choiceText);
        setChoice4Grade(question.choices[3].grade);
    
        setChoice5(question.choices[4].choiceText);
        setChoice5Grade(question.choices[4].grade); 
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSaveChangesAndContinueEditing = (event) => {
    event.preventDefault();
    const questionBody = {
      id: id,
      name: name,
      text: text,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };
    
    if (choice1) {
      questionBody.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
      });
    }

    if (choice2) {
      questionBody.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
      });
    }

    if (choice3) {
      questionBody.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
      });
    }

    if (choice4) {
      questionBody.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
      });
    }

    if (choice5) {
      questionBody.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
      });
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionBody),
    };
    fetch(`http://localhost:8080/api/question/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(id);
        console.log(data);
        alert("Question saved!")
        
      })
      .catch((error) => console.log(error));
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();
    const questionBody = {
      id: id,
      name: name,
      text: text,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };
    
    if (choice1) {
      questionBody.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
      });
    }

    if (choice2) {
      questionBody.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
      });
    }

    if (choice3) {
      questionBody.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
      });
    }

    if (choice4) {
      questionBody.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
      });
    }

    if (choice5) {
      questionBody.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
      });
    }

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionBody),
    };
    fetch(`http://localhost:8080/api/question/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log('Question saved:', data);
        alert("Question saved!")
        navigate("/Question");

      })
      .catch((error) => console.log(error));
  };

  const handleCancel = () => {
    navigate("/Question");
  };
  

  return (
    <div className="edit-question">
      <h1> Editing a Mutiple choice question</h1>
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
              text = {text}
              setText = {setText}
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
          setGrade={setChoice1Grade} />
        </div>

        <div className="choice">
          <ChoiceField 
          label="Choice 2" 
          text={choice2}
          setText={setChoice2} 
          grade={choice2Grade} 
          setGrade={setChoice2Grade} />
        </div>

        {showAdditionalChoices && (
          <>
            <div className="choice">
              <ChoiceField 
              label="Choice 3" 
              text={choice3} 
              setText={setChoice3} 
              grade={choice3Grade} 
              setGrade={setChoice3Grade} />
            </div>

            <div className="choice">
            <ChoiceField 
              label="Choice 4" 
              text={choice4}
              setText={setChoice4} 
              grade={choice4Grade} 
              setGrade={setChoice4Grade} />
            </div>

            <div className="choice">
            <ChoiceField 
              label="Choice 5" 
              text={choice5} 
              setText={setChoice5}
              grade={choice5Grade} 
              setGrade={setChoice5Grade} />
            </div>
          </>
        )}

        <div className="button-in-editing">
          <button
            className="button-1"
            onClick={() => setShowAdditionalChoices(!showAdditionalChoices)}>
            BLANKS FOR 3 MORE CHOICES
          </button>

          <button 
          className="button-2" 
          type="submit"
          onClick={handleSaveChangesAndContinueEditing}>
            SAVE CHANGES AND CONTINUE EDITING
          </button>

          <div className="button-group button34">
            <button 
            className="button-3" 
            type="submit"
            onClick={handleSaveChanges}>
              SAVE CHANGES
            </button>

            <button 
            className="button-4"
            onClick={handleCancel}>
              CANCEL
            </button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;