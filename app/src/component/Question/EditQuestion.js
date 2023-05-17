import React, { useState, useEffect} from 'react';
import './EditQuestion.css';
import { useLocation } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const EditQuestion = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [defaultMark, setDefaultMark] = useState(0);

   // lấy giá trị của id từ query parameter
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const id = queryParams.get('id');
   console.log(location.search);

   useEffect(() => {
    // gửi yêu cầu API để tải câu hỏi đã chọn từ máy chủ
    fetch(`http://localhost:8080/api/question/${id}`)
      .then(response => response.json())
      .then(question => {
        // set giá trị mặc định cho các input field
        console.log(question);
        setSelectedCategory(question.category.id);
        setName(question.name);
        setText(question.text);
        setDefaultMark(question.defaultMark);
      })
      .catch(error => {
        console.log(error);
      });
      
    // lấy danh sách các category
    fetch('http://localhost:8080/api/categories')
      .then(response => response.json())
      .then(categories => {
        const options = categories.map(category => ({ value: category.id, label: category.name }));
        setCategoryOptions(options);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <div className='edit-question'>
      <h1> Editing a Mutiple choice question</h1>
      <h5><FaChevronDown style={{color: 'blue'}} /> General </h5>
      
      <div className='row'>
        <div className="col-25">
          <p>Category</p>
        </div>
        <div className="col-75">
          <select value={selectedCategory} onChange={handleCategoryChange}>
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          </select>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>

          <div className="row">
            <div className="col-25">
              <label>Question name</label>
            </div>
            <div className="col-75">
              <input className='name' type='text' value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          </div>
          
          <div className="row">
            <div className="col-25">
              <label>Question text</label>
            </div>
            <div className="col-75">
            <textarea className='text' type='text' value={text} onChange={(event) => setText(event.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-25">
              <label>Default mark</label>
            </div>
            <div className="col-75">
            <input className='mark' type='number' value={defaultMark} onChange={(event) => setDefaultMark(parseInt(event.target.value))} />
            </div>
          </div>
        <div className='button-in-editing'>
          <button className='button-1'>BLANKS FOR 3 MORE CHOICES</button>
          <button className='button-2' type='submit'> SAVE CHANGES AND CONTINUE EDITING</button>
          <div className='button-group button34'>
            <button className='button-3' type='submit'>SAVE CHANGES</button>
            <button className='button-4'>CANCEL</button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default EditQuestion