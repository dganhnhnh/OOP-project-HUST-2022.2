import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MyCourses from './component/NavBar/MyCourses.js';
import Thicuoiki from './component/NavBar/Thicuoiki';
import Question from './component/Question/Question';
import Categories from './component/Category/Categories';
import Import from './component/DropDownMenu/Import';
import Export from './component/DropDownMenu/Export';
import Navigation from './component/DropDownMenu/Navigation'
import Home from './component/NavBar/Home'
import EditQuestion from './component/Question/EditQuestion';
import AddNewQuestion from './component/Question/AddNewQuestion';
import QuizInterface from './component/Quiz/QuizInterface/QuizInterface';
import NewQuiz from './component/Quiz/AddNewQuiz/NewQuiz';
import EditingQuiz from './component/Quiz/EditingQuiz/EditingQuiz'
import QuestionBank from './component/Quiz/AddQuestion/QuestionBank/QuestionBank';
import ExistingCategory from './component/Quiz/AddQuestion/RandomQuestion/ExistingCategory';
import NewCategory from './component/Quiz/AddQuestion/RandomQuestion/NewCategory'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route exact path='/' element={<App />}>
          <Route path='/Home' element={<Home />} />
          <Route path='/MyCourses' element={<MyCourses />}></Route>
          <Route exact path='/QuizInterface' element={<QuizInterface />} />
          <Route exact path='/EditingQuiz' element={<EditingQuiz />} />
          <Route exact path='/QuestionBank' element={<QuestionBank />} />
          <Route exact path='/ExistingCategory' element={<ExistingCategory />} />
          <Route exact path='/NewCategory' element={<NewCategory />} />
          <Route exact path='/Thicuoiki' element={<Thicuoiki />} />

          <Route path='/EditQuestion' element={<EditQuestion />} />
          <Route path='/AddNewQuestion' element={<AddNewQuestion />} />
          <Route path='/' element={<Navigation />}>
            <Route path='/Question' element={<Question />} />
            <Route path='/Categories' element={< Categories />} />
            <Route path='/Import' element={<Import />} />
            <Route path='/Export' element={<Export />} />
          </Route>

          <Route path='/Addnewquiz' element={<NewQuiz />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();