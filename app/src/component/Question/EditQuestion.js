import React, { useState, useEffect } from "react";
import "./EditQuestion.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import ChoiceField from "./ChoiceField";
import MyEditor from "./MyEditor";

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
  const [imageURL, setImageURL] = useState("");
  const [showAdditionalChoices, setShowAdditionalChoices] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});

  const [choice1, setChoice1] = useState("");
  const [choice1Grade, setChoice1Grade] = useState(0);
  const [c1_imageURL, setC1_ImageURL] = useState("");

  const [choice2, setChoice2] = useState("");
  const [choice2Grade, setChoice2Grade] = useState(0);
  const [c2_imageURL, setC2_ImageURL] = useState("");

  const [choice3, setChoice3] = useState("");
  const [choice3Grade, setChoice3Grade] = useState(0);
  const [c3_imageURL, setC3_ImageURL] = useState("");

  const [choice4, setChoice4] = useState("");
  const [choice4Grade, setChoice4Grade] = useState(0);
  const [c4_imageURL, setC4_ImageURL] = useState("");

  const [choice5, setChoice5] = useState("");
  const [choice5Grade, setChoice5Grade] = useState(0);
  const [c5_imageURL, setC5_ImageURL] = useState("");

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
        setImageURL(question.imageURL);
        setDefaultMark(question.defaultMark);

        setChoice1(question.choices[0].choiceText);
        setChoice1Grade(question.choices[0].grade);
        setC1_ImageURL(question.choices[0].c_imageURL);


        setChoice2(question.choices[1].choiceText);
        setChoice2Grade(question.choices[1].grade);
        setC2_ImageURL(question.choices[1].c_imageURL); 

        setChoice3(question.choices[2].choiceText);
        setChoice3Grade(question.choices[2].grade);
        setC3_ImageURL(question.choices[2].c_imageURL); 
 
    
        setChoice4(question.choices[3].choiceText);
        setChoice4Grade(question.choices[3].grade);
        setC4_ImageURL(question.choices[3].c_imageURL); 

    
        setChoice5(question.choices[4].choiceText);
        setChoice5Grade(question.choices[4].grade); 
        setC5_ImageURL(question.choices[4].c_imageURL); 

  
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
      id: id,
      name: name,
      text: text,
      imageURL: imageURL,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };
    
    if (choice1) {
      questionBody.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
        c_imageURL: c1_imageURL,
      });
    }

    if (choice2) {
      questionBody.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
        c_imageURL: c2_imageURL,
      });
    }

    if (choice3) {
      questionBody.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
        c_imageURL: c3_imageURL,
      });
    }

    if (choice4) {
      questionBody.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
        c_imageURL: c4_imageURL,
      });
    }

    if (choice5) {
      questionBody.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
        c_imageURL: c5_imageURL,
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
      imageURL: imageURL,
      defaultMark: defaultMark,
      categoryID: selectedCategory,
      choices: [],
    };
    
    if (choice1) {
      questionBody.choices.push({
        choiceText: choice1,
        grade: choice1Grade,
        c_imageURL: c1_imageURL,
      });
    }

    if (choice2) {
      questionBody.choices.push({
        choiceText: choice2,
        grade: choice2Grade,
        c_imageURL: c2_imageURL,
      });
    }

    if (choice3) {
      questionBody.choices.push({
        choiceText: choice3,
        grade: choice3Grade,
        c_imageURL: c3_imageURL,
      });
    }

    if (choice4) {
      questionBody.choices.push({
        choiceText: choice4,
        grade: choice4Grade,
        c_imageURL: c4_imageURL,
      });
    }

    if (choice5) {
      questionBody.choices.push({
        choiceText: choice5,
        grade: choice5Grade,
        c_imageURL: c5_imageURL,
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
            <MyEditor
              text = {`<p>${text}</p><p><img src =${imageURL}></p>`}
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
          c_imageURL={c1_imageURL}
          setC_ImageURL={setC1_ImageURL}
          setText={setChoice1} 
          grade={choice1Grade} 
          setGrade={setChoice1Grade} />
        </div>

        <div className="choice">
          <ChoiceField 
          label="Choice 2" 
          text={choice2}
          c_imageURL={c2_imageURL}
          setC_ImageURL={setC2_ImageURL} 
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
              c_imageURL={c3_imageURL}
              setC_ImageURL={setC3_ImageURL}
              setText={setChoice3} 
              grade={choice3Grade} 
              setGrade={setChoice3Grade} />
            </div>

            <div className="choice">
            <ChoiceField 
              label="Choice 4" 
              text={choice4}
              c_imageURL={c4_imageURL}
              setC_ImageURL={setC4_ImageURL} 
              setText={setChoice4} 
              grade={choice4Grade} 
              setGrade={setChoice4Grade} />
            </div>

            <div className="choice">
            <ChoiceField 
              label="Choice 5" 
              text={choice5} 
              setText={setChoice5}
              c_imageURL={c5_imageURL}
              setC_ImageURL={setC5_ImageURL}
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