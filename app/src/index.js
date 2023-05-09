import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MyCourses from './component/MyCourses/MyCourses.js';
import Thicuoiki from './component/Thicuoiki/Thicuoiki';
import Question from './component/Thicuoiki/Question';
import Categories from './component/Thicuoiki/Categories';
import Import from './component/Thicuoiki/Import';
import Export from './component/Thicuoiki/Export';
import Navigation from './component/Navbar/Navigation'
import Home from './component/Home'
import New_quiz from './component/Quiz/Add_new_quiz/New_quiz';
import Quiz_61 from './component/Quiz/Quizz_interface/Quiz_61';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/Home' element={<Home />} />

          <Route path='/MyCourses' element={<MyCourses />}>
            <Route path='general/thicuoiki2moncongnghe' element={<Quiz_61 />} />
          </Route>

          <Route path='/Thicuoiki' element={<Thicuoiki />} />

          <Route path='/' element={<Navigation/>}>
            <Route path='/Question' element={<Question />} />
            <Route path='/Categories' element={< Categories/>} />
            <Route path='/Import' element={<Import/>} />
            <Route path='/Export' element={<Export/>} />
          </Route>

          <Route path='/addnewquiz' element={<New_quiz />}  />
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
