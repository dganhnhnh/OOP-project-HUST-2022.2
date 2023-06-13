import React, { useState, useEffect } from 'react';

function renderCategoryOptions(categories, questionsByCategory, level = 0) {
  const options = [];

  categories.forEach((category) => {
    const isSubcategory = categories.find((c) =>
      c.subCatID.includes(category.id)
    );

    const questions = questionsByCategory[category.id] || [];
    if (!isSubcategory)
      options.push(
        <option key={category.id} value={category.id}>
          {category.name} ({questions.length})
        </option>
      );

    if (!isSubcategory) {
      const subcategories = categories.filter(
        (c) => c.parentId === category.id
      );

      subcategories.forEach((subcategory) => {
        const subQuestions = questionsByCategory[subcategory.id] || [];

        options.push(
          <option key={subcategory.id} value={subcategory.id}>
            {"\u00A0".repeat(level + 5) + subcategory.name}(
            {subQuestions.length})
          </option>
        );
      });
    }
  });

  return options;
}

function SelectCategory ({selectedCategory,setSelectedCategory,categories,
    setCategories, questionsByCategory, setQuestionsByCategory }) {
  useEffect(() => {
    // lấy danh sách các category
    fetch("http://localhost:8080/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        const subcategories = categories.flatMap((category) =>
          category.subCatID.map((subcatID) => ({
            ...categories.find((c) => c.id === subcatID),
            parentId: category.id,
          }))
        );
        const allCategories = subcategories.concat(categories);
        setCategories(allCategories);
        Promise.all(
          allCategories.map((category) => {
            const url = `http://localhost:8080/api/category/${category.id}/questions?show_from_subcategory=true`;
            return fetch(url)
              .then((response) => response.json())
              .then((questions) => ({ categoryId: category.id, questions }));
          })
        ).then((results) => {
          const newQuestionsByCategory = {};
          results.forEach(({ categoryId, questions }) => {
            newQuestionsByCategory[categoryId] = questions;
          });
          setQuestionsByCategory(newQuestionsByCategory);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  return (
    <select value={selectedCategory} onChange={handleCategoryChange}>
      {renderCategoryOptions(categories, questionsByCategory)}
    </select>
  );
};

export default SelectCategory;
