import React, { useState, useEffect } from "react";
import "./Category.css";
import { FaChevronDown } from "react-icons/fa";


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

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});

  useEffect(() => {
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

  function findParentCategory(subCatId) {
    const subcategory = categories.find(c => c.subCatID.includes(subCatId));
    if (subcategory && subcategory.parentId) {
      return categories.find(c => c.id === subcategory.parentId);
    }
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const url = 'http://localhost:8080/api/category';
    const parentCategory = findParentCategory(selectedCategory);
    const data = {
      name: name,
      info: info,
      parent: parentCategory ? parentCategory.name : null
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