import React, { useState, useEffect } from 'react';
import './Question.css';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

const Question = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('default');
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(response => response.json())
      .then(categories => {
        const options = categories.map(category => ({ value: category.id, label: category.name }));
        setOptions([{ value: 'default', label: 'Default' }, ...options]);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSelectChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleCheckbox1Change = event => {
    setCheckbox1(event.target.checked);
  };

  const handleCheckbox2Change = event => {
    setCheckbox2(event.target.checked);
  };

  return (
    <div className='questionpage'>
      <h1 className='title'>Question Bank</h1>
      <div className='selected-menu'>
        <p>Select a category:</p>
        <select value={selectedValue} onChange={handleSelectChange}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p> The default category for questions shared in context</p>
      <div className='checkbox'>
        <Checkbox label="Also show questions from subcategories" checked={checkbox1} onChange={handleCheckbox1Change} />
        <Checkbox label="Also show old question" checked={checkbox2} onChange={handleCheckbox2Change} />
      </div>
      <button className='button-in-question'>CREATE A NEW QUESTION</button>
    </div>
  )
}

export default Question
