import React, { useState, useEffect, useRef } from 'react';
import { SlMagnifierAdd } from 'react-icons/sl'
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { TiPlus } from 'react-icons/ti'
import './QuestionBank.css';
import { decode } from "html-entities";
import SelectCategory from '../../../Category/SelectCategory';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

const QuestionBank = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showOldQuestions, setShowOldQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [checkedQuestionIds, setCheckedQuestionIds] = useState([]);

  // lấy giá trị của id từ query parameter
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

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
// const addCheckedQuestionsToQuiz = async (id) => {
//   try {
//     // Retrieve existing quiz data from API endpoint
//     const response = await fetch(`http://localhost:8080/api/quiz/${id}`);
//     if (!response.ok) {
//       throw new Error('Failed to retrieve quiz data.');
//     }
//     const quizData = await response.json();
//     console.log(quizData);
    
//     // Get array of IDs for questions already in the quiz
//     const existingQuestionIds = quizData.questionsID || [];
//     console.log(existingQuestionIds)
//     // Get array of IDs for selected questions to add to the quiz
//     const selectedQuestionIds = questions.filter(q => q.checked).map(q => q.id);
//     console.log(selectedQuestionIds)
//     // Combine existing and selected question IDs
//     const updatedQuestionIds = [...existingQuestionIds, ...selectedQuestionIds];
//     console.log(updatedQuestionIds)
//     // Create updated quiz object with new question IDs
//     const updatedQuizData = {
//       ...quizData,
//       questionsID: updatedQuestionIds
//     };

//     // Send PUT request to API to update quiz data
//     const requestOptions = {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedQuizData)
//     };
//     const updateResponse = await fetch(`http://localhost:8080/api/quiz/${id}`, requestOptions);
//     if (!updateResponse.ok) {
//       throw new Error('Failed to add selected questions to quiz.');
     
//     }

//     // Handle successful response
//     console.log('Selected questions added to quiz successfully!');
//   } catch (error) {
//     console.error(error);
//   }
// };

  const addCheckedQuestionsToQuiz = () => {
    // get the current quiz object from the server
    fetch(`http://localhost:8080/api/quiz/${id}`)
      .then((response) => response.json())
      .then((quiz) => {
        // get the existing array of question IDs and append the new ones to it
        const existingQuestions = quiz.questionsID || [];
        console.log(existingQuestions);
        const newQuestionIds = questions
          .filter((question) => question.checked)
          .map((question) => question.id);
        console.log(newQuestionIds);
        // Remove any question IDs that are already present in existingQuestions
        const filteredNewQuestionIds = newQuestionIds.filter(
          (newQuestionId) => !existingQuestions.includes(newQuestionId)
        );
        console.log(filteredNewQuestionIds);

        const updatedQuestions = [
          ...existingQuestions,
          ...filteredNewQuestionIds,
        ];
        console.log(updatedQuestions);
        // create an updated quiz object with the new question IDs
        const updatedQuiz = { ...quiz, questionsID: updatedQuestions };
        console.log(updatedQuestions);
        // update the quiz object on the server
        return fetch(`http://localhost:8080/api/quiz/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuiz),
        });
      })
      .then((response) => {
        if (response.ok) {
          console.log("Quiz updated successfully");
          alert("Add questions to quiz successfully");
        } else {
          throw new Error("Failed to update quiz");
        }
      })
      .catch((error) => console.error(error)); // TODO: handle error appropriately
  };

  return (
    <div className='questionpage'>
      <p className='title'>Add from the question bank at the end</p>

      <div className='selected-menu'>
        <p>Select a category:</p>
        <SelectCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setCategories={setCategories}
        />
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
      <button className="button-in-question" onClick={() => addCheckedQuestionsToQuiz(id)}>
        ADD SELECTED QUESTION TO THE QUIZ
      </button>

    </div>
  )
}

export default QuestionBank