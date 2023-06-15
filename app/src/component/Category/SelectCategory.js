import React, { useEffect, useState } from 'react';

function SelectCategory ({selectedCategory, setSelectedCategory}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(response => response.json())
      .then(data => {
        // Sort categories by parent-child relationship
        const sortedCategories = sortCategories(data);
        setCategories(sortedCategories);
        console.log(categories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Recursive function to sort categories by parent-child relationship
  const sortCategories = (categories, parentId = null) => {
    const sorted = [];
    for (const category of categories) {
      if (category.parentID === parentId) {
        const subCategories = sortCategories(categories, category.id);
        category.subCategories = subCategories;
        sorted.push(category);
      }
    }
    return sorted;
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  }

  // Recursive function to render categories and sub-categories
const renderCategories = (categories, indentLevel = 0) => {
  return categories.map(category => (
    <React.Fragment key={category.id}>
      <option value={category.id} style={{ marginLeft: `${indentLevel * 20}px` }}>
        {"\u00A0".repeat(indentLevel) + category.name} ({category.questionID.length})
      </option>
      {category.subCategories && renderCategories(category.subCategories, indentLevel + 3)}
    </React.Fragment>
  ));
};

  return (
    <select value={selectedCategory} onChange={handleCategoryChange}>
      {renderCategories(categories)}
    </select>
  );
};

export default SelectCategory;

