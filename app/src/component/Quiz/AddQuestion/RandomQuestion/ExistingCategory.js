import React, { useState, useEffect, useRef } from 'react';
import { SlMagnifierAdd } from 'react-icons/sl'
import { useLocation, useNavigate } from "react-router-dom";
import './RandomQuetion.css';
import { NavLink, Link } from 'react-router-dom';
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { decode } from "html-entities";

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

function renderCategoryOptions(categories, questionsByCategory, level = 0) {
  const options = [];

  categories.forEach(category => {
    const isSubcategory = categories.find(c => c.subCatID.includes(category.id));

    const questions = questionsByCategory[category.id] || [];
    if (!isSubcategory)
      options.push(
        <option key={category.id} value={category.id}>
          {category.name} ({questions.length})
        </option>
      );

    if (!isSubcategory)
    {
      const subcategories = categories.filter(c => c.parentId === category.id);

      subcategories.forEach(subcategory => {
        const subQuestions = questionsByCategory[subcategory.id] || [];

        options.push(
          <option key={subcategory.id} value={subcategory.id}>
            {'\u00A0'.repeat(level + 5) + subcategory.name}({subQuestions.length})
          </option>
        );
      });
    }
  });

  return options;
}

const ExistingCategory = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [checkedQuestionIds, setCheckedQuestionIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);;
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [numberRandom, setNumberRandom] = useState('0');
  const navigate = useNavigate();

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
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

  useEffect(() => {
    const categoryId = selectedCategory || categories[0]?.id;
    const url = `http://http://localhost:8080/api/questions`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        console.log(questions);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedCategory, showSubcategories]);

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
    console.log(selectedCategory);
  };

  const handleShowSubcategoriesChange = event => {
    setShowSubcategories(event.target.checked);
  };


  const selectedQuestions = Array.isArray(questions)? questions.sort(() => Math.random() - 0.5).slice(0, numberRandom):[];
  const displayQuestions = selectedQuestions.map(question => (
    <div key={question.id}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <AiOutlineUnorderedList style={{ marginTop: "20px", marginLeft: "10px" }} />
        <div style={{ fontSize: "17px", marginTop: "15px", paddingLeft: "20px" }}>{decode(question.text).replace(/<[^>]+>/g, "")}</div>
      </div>
      <div className="action-btns">
        <button className="detail-btn">
          <SlMagnifierAdd style={{ color: "rgb(31, 130, 201)" }} />
        </button>
      </div>
    </div>
  ));

  const listRandomQuestions = (event) => {
    const numRandom = parseInt(event.target.value, 10); // parse the input value as an integer
    setNumberRandom(numRandom); // update the numberRandom state variable
    // console.log(numberRandom)
    // console.log(selectedCategory);
    const categoryId = parseInt(selectedCategory, 10);
    // console.log(categoryId)
    const availableQuestions = questionsByCategory[categoryId];
    // console.log(availableQuestions);
    const numQuestions = Math.min(numRandom, availableQuestions.length);
    
    const selectedQuestions = [];
    while (selectedQuestions.length < numQuestions)
    {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const randomQuestion = availableQuestions[randomIndex];
      if (!selectedQuestions.find(q => q.id === randomQuestion.id))
      {
        selectedQuestions.push(randomQuestion);
        
      }
    }
    console.log(selectedQuestions)
    setCheckedQuestionIds(selectedQuestions.map(q => q.id)); // update the checkedQuestionIds state variable
    setQuestions(selectedQuestions); // update the questions state variable
  };
  const addRandomQuestionsToQuiz = async () => {
  try {
    // get the current quiz object from the server
    const response = await fetch(`http://localhost:8080/api/quiz/${id}`);
    const quiz = await response.json();

    // get the existing array of question IDs and append the new ones to it
    const existingQuestions = quiz.questionsID || [];
    console.log(existingQuestions);

    const newQuestionIds = questions.map(question => question.id);
    console.log(newQuestionIds);

    const updatedQuestions = [...existingQuestions, ...newQuestionIds.filter(id => !existingQuestions.includes(id))];
    console.log(updatedQuestions);

    // create an updated quiz object with the new question IDs
    const updatedQuiz = { ...quiz, questionsID: updatedQuestions };
    console.log(updatedQuestions);

    // update the quiz object on the server
    const putResponse = await fetch(`http://localhost:8080/api/quiz/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuiz),
    });

    if (putResponse.ok) {
      console.log('Quiz add more questions successfully');
    } else {
      throw new Error('Failed to update quiz');
    }
  }
  catch (error) {
    console.error(error);
    // TODO: handle error appropriately
  }
};

  const QuestionRandomLink = ({ id }) => {
    return (
      <Link to={`/ExistingCategory?id=${id}`}>
        <span> ExistingCategory</span>
      </Link>
    );
  };
  const NewCategory = ({ id }) => {
    return (
      <Link to={`/NewCategory?id=${id}`}>
        <span> New Category</span>
      </Link>
    );
  };
  return (
    <div className='questionrandom'>
      <p className='title'>Add a random question to page 1</p>
      <div className="navbarRandom">
        <ul className='randomBar'>
          <li>
          <QuestionRandomLink id={id}></QuestionRandomLink>
          </li>
          <li>
          <NewCategory id={id}></NewCategory>
          </li>
        </ul>
      </div>
      <div className='selected-menu'>
        <p>Category:</p>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {renderCategoryOptions(categories, questionsByCategory)}
        </select>
      </div>
      <div>
        <Checkbox className="include"
          label="include questions from subcategories too"
          checked={showSubcategories}
          onChange={handleShowSubcategoriesChange}
        />
      </div>

      <label htmlFor='num-questions'>Number of random questions:</label>
      <input className="num-questions" type='number' value={numberRandom}
        onChange={event => listRandomQuestions(event)} />

      <div className="display-question-random">
  {selectedQuestions.length === 0 ? (
    <p>No questions found.</p>
  ) : selectedQuestions.length < numberRandom ? (
    <p>Not enough questions in the question bank.</p>
  ) : (
    displayQuestions
  )}
</div>
      <button className="button-in-question" onClick={() => addRandomQuestionsToQuiz()}>
        ADD RANDOM QUESTION TO THE QUIZ
      </button>


    </div>
  )
}

export default ExistingCategory