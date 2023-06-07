import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlMagnifierAdd } from 'react-icons/sl'
import './QuestionBank.css';

const deleteQuestion = async (id, setQuestions, questions) => {
  try
  {
    await fetch(`http://localhost:8080/api/question/${id}`, {
      method: 'DELETE',
    });
    const updatedQuestions = questions.filter(question => question.id !== id);
    setQuestions(updatedQuestions);
  } catch (error)
  {
    console.log(error);
  }
};

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

const QuestionBank = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showOldQuestions, setShowOldQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const navigate = useNavigate();

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
    const url = `http://localhost:8080/api/category/${categoryId}/questions?show_from_subcategory=${showSubcategories}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [selectedCategory, showSubcategories]);

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
  };

  const handleShowSubcategoriesChange = event => {
    setShowSubcategories(event.target.checked);
  };

  const handleShowOldQuestionsChange = event => {
    setShowOldQuestions(event.target.checked);
  };

  function handleEditButtonClick(question) {
    const url = `/EditQuestion?id=${question.id}`;
    navigate(url);
  }

  const handleCreateNewQues = () => {
    navigate("/AddNewQuestion");
  };

  return (
    <div className='questionpage'>
      <p className='title'>Add from the question bank at the end</p>

      <div className='selected-menu'>
        <p>Select a category:</p>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          {renderCategoryOptions(categories, questionsByCategory)}
        </select>
      </div>
      <div className='checkbox'>
        <p className='search'>Search options</p>
        <Checkbox label="Also show questions from subcategories" checked={showSubcategories} onChange={handleShowSubcategoriesChange} />
        <Checkbox label="Also show old question" checked={showOldQuestions} onChange={handleShowOldQuestionsChange} />
      </div>


      <div className='display-question'>
        {questions.length > 0 ? (
          questions.map(question => (
            <div key={question.id}>
              <div>{question.name}</div>
              <div className="action-btns">
                <button className="detail-btn"><SlMagnifierAdd style={{ color: "rgb(31, 130, 201)" }} /></button>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found.</p>
        )}
      </div>
      <button
        className='button-in-question'>
        ADD SELECTED QUESTION TO THE QUIZ
      </button>
    </div>
  )
}

export default QuestionBank