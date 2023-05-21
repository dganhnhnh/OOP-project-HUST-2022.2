import React, { useState, useEffect } from "react";
import "./EditQuestion.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import ChoiceField from "./ChoiceField";

function renderCategoryOptions(categories, questionsByCategory, level = 0) {
  const options = [];

  categories.forEach(category => {
    const isSubcategory = categories.find(c => c.subCatID.includes(category.id));

    const questions = questionsByCategory[category.id] || [];
    if(!isSubcategory)
    options.push(
      <option key={category.id} value={category.id}>
        {category.name} ({questions.length})
      </option>
    );

    if (!isSubcategory) {
      const subcategories = categories.filter(c => c.parentId === category.id);

      subcategories.forEach(subcategory => {
        const subQuestions = questionsByCategory[subcategory.id] || [];

        options.push(
          <option key={subcategory.id} value={subcategory.id}>
            { '\u00A0'.repeat(level + 5) + subcategory.name }({subQuestions.length})
          </option>
        );
      });
    }
  });

  return options;
}

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

    // lấy danh sách các category
    fetch('http://localhost:8080/api/categories')
      .then(response => response.json())
      .then(categories => {
        const subcategories = categories.flatMap(category => category.subCatID.map(subcatID => ({
          ...categories.find(c => c.id === subcatID),
          parentId: category.id
        })));
        const allCategories = subcategories.concat(categories);
        setCategories(allCategories);
        Promise.all(allCategories.map(category => {
          const url = `http://localhost:8080/api/category/${category.id}/questions?show_from_subcategory=true`;
          return fetch(url)
            .then(response => response.json())
            .then(questions => ({ categoryId: category.id, questions }));
        })).then(results => {
          const newQuestionsByCategory = {};
          results.forEach(({ categoryId, questions }) => {
            newQuestionsByCategory[categoryId] = questions;
          });
          setQuestionsByCategory(newQuestionsByCategory);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSaveChangesAndContinueEditing = (event) => {
    event.preventDefault();
    const questionBody = {
      name,
      text,
      defaultMark,
      categoryID: selectedCategory,
      choices: [
        { choiceText: choice1, grade: choice1Grade },
        { choiceText: choice2, grade: choice2Grade },
        { choiceText: choice3, grade: choice3Grade },
        { choiceText: choice4, grade: choice4Grade },
        { choiceText: choice5, grade: choice5Grade },
      ],
    };
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionBody),
    };
    fetch(`http://localhost:8080/api/question/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Question saved!")
      })
      .catch((error) => console.log(error));
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();
    const questionBody = {
      name,
      text,
      defaultMark,
      categoryID: selectedCategory,
      choices: [
          { choiceText: choice1, grade: choice1Grade },
          { choiceText: choice2, grade: choice2Grade },
          { choiceText: choice3, grade: choice3Grade },
          { choiceText: choice4, grade: choice4Grade },
          { choiceText: choice5, grade: choice5Grade },
      ],
    };
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
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {renderCategoryOptions(categories, questionsByCategory)}
          </select>
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
            <textarea
              className="text"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
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