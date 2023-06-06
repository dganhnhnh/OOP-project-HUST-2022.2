import React, { useState, useEffect } from "react";
import "./Category.css";
import { FaChevronDown } from "react-icons/fa";
import SelectCategory from "../Category/SelectCategory";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const url = 'http://localhost:8080/api/category';
    const data = {
      name: name,
      info: info,
      parent: selectedCategory,
    };
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(category => {
        console.log('New category added:', category);
        // Do something with the new category, such as updating the UI.
        alert("Category saved!");
        // Clear the form inputs
        setSelectedCategory('');
        setName('');
        setInfo('');
      })
      .catch(error => {
        console.error('Error adding category:', error);
      });
  };
  

  return (
    <div className="add-category-page">
      <h5>
        <FaChevronDown style={{ color: "blue" }}/>Add Category {" "}
      </h5>

      <div className="row">
        <div className="col-40">
          <p>Parent category</p>
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
            <label>Name</label>
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
            <label>Category info</label>
          </div>
          <div className="col-60">
            <textarea
              className="text"
              type="text"
              value={info}
              onChange={(event) => setInfo(event.target.value)}
            />
          </div>
        </div>

        <div className="button-in-editing">
            <button 
            className="button-3" 
            type="submit">
              ADD CATEGORY
            </button>
        </div>
      </form>
    </div>
  );
};

export default Categories