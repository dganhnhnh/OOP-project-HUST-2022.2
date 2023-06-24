import React, { useState, useEffect, useRef } from 'react';
import { SlMagnifierAdd } from 'react-icons/sl'
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { TiPlus } from 'react-icons/ti'
import './QuestionBank.css';
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

const QuestionBank = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showOldQuestions, setShowOldQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [checkedQuestionIds, setCheckedQuestionIds] = useState([]);
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

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;

    if (isChecked)
    {
      setCheckedQuestionIds([...checkedQuestionIds, id]);
    } else
    {
      setCheckedQuestionIds(checkedQuestionIds.filter(checkedId => checkedId !== id));
    }
    const updatedQuestions = questions.map(question => {
      if (question.id === id)
      {
        return {
          ...question,
          checked: isChecked
        };
      }
      return question;
    });

    setQuestions(updatedQuestions);
    return updatedQuestions; // add this line
  };

  // add question to quiz
  const addCheckedQuestionsToQuiz = () => {
    // get the current quiz object from the server
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then(response => response.json())
      .then(quiz => {
        // get the existing array of question IDs and append the new ones to it
        const existingQuestions = quiz.questionsID || [];
        const newQuestionIds = questions
          .filter(question => question.checked)
          .map(question => question.id);
        const updatedQuestions = [...existingQuestions, ...newQuestionIds];

        // create an updated quiz object with the new question IDs
        const updatedQuiz = { ...quiz, questionsID: updatedQuestions };

        // update the quiz object on the server
        return fetch(`http://localhost:8080/api/quiz/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedQuiz),
        });
      })
      .then(response => {
        if (response.ok)
        {
          console.log('Quiz updated successfully');
        }
        else
        {
          throw new Error('Failed to update quiz');
        }
      })
      .catch(error => console.error(error)); // TODO: handle error appropriately
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


      <div className="display-question">
        {questions.length > 0 ? (
          questions.map(question => (
            <div key={question.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TiPlus style={{ marginTop: "15px", color: "rgb(8, 79, 123)" }} />
                <input
                  type="checkbox"
                  style={{ marginTop: "15px", marginRight: "5px" }}
                  checked={question.checked}
                  onChange={event => handleCheckboxChange(event, question.id)}
                />
                <AiOutlineUnorderedList style={{ marginTop: "15px", marginRight: "20px" }} />
                <div style={{ fontSize: "17px", marginTop: "15px" }}>{decode(question.text).replace(/<[^>]+>/g, "")}</div>
              </div>
              <div className="action-btns">
                <button className="detail-btn">
                  <SlMagnifierAdd style={{ color: "rgb(31, 130, 201)" }} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No questions found.</p>
        )}
      </div>
      <button className="button-in-question" onClick={() => addCheckedQuestionsToQuiz()}>
        ADD SELECTED QUESTION TO THE QUIZ
      </button>

    </div>
  )
}

export default QuestionBank