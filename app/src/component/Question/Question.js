import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Question.css";
import { decode } from "html-entities";
import SelectCategory from "../Category/SelectCategory";

const deleteQuestion = async (id, setQuestions, questions) => {
  try {
    await fetch(`http://localhost:8080/api/question/${id}`, {
      method: "DELETE",
    });
    const updatedQuestions = questions.filter((question) => question.id !== id);
    setQuestions(updatedQuestions);
  } catch (error) {
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

const Question = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showOldQuestions, setShowOldQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const categoryId = selectedCategory || categories[0]?.id;
    const url = `http://localhost:8080/api/category/${categoryId}/questions?show_from_subcategory=${showSubcategories}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedCategory, showSubcategories]);

  const handleShowSubcategoriesChange = (event) => {
    setShowSubcategories(event.target.checked);
  };

  const handleShowOldQuestionsChange = (event) => {
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
    <div className="questionpage">
      <h1 className="title">Question Bank</h1>

      <div className="selected-menu">
        <p>Select a category:</p>
        <SelectCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setCategories={setCategories}
          questionsByCategory={questionsByCategory}
          setQuestionsByCategory={setQuestionsByCategory}
        />
      </div>
      <div className="checkbox-in-question">
        <Checkbox
          label="Also show questions from subcategories"
          checked={showSubcategories}
          onChange={handleShowSubcategoriesChange}
        />
        <Checkbox
          label="Also show old question"
          checked={showOldQuestions}
          onChange={handleShowOldQuestionsChange}
        />
      </div>
      <button className="button-in-question" onClick={handleCreateNewQues}>
        CREATE A NEW QUESTION
      </button>

      <div className="display-question">
        {questions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => {
                const plainText = decode(question.text).replace(/<[^>]+>/g, "");
                return (
                  <tr key={question.id}>
                    <td>{plainText}</td>
                    <td className="action-btns">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditButtonClick(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteQuestion(question.id, setQuestions, questions)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default Question;
