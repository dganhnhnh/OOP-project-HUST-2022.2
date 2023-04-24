import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MyCourses from './component/NavBar/MyCourses.js';
import Thicuoiki from './component/NavBar/Thicuoiki';
import Question from './component/DropDownMenu/Question';
import Categories from './component/DropDownMenu/Categories';
import Import from './component/DropDownMenu/Import';
import Export from './component/DropDownMenu/Export';
import Navigation from './component/DropDownMenu/Navigation'
import Home from './component/NavBar/Home'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<App/>}>
          <Route path='/Home' element={<Home />} />
          <Route path='/MyCourses' element={<MyCourses />} />
          <Route path='/Thicuoiki' element={<Thicuoiki />} />
          <Route path='/' element={<Navigation/>}>
            <Route path='/Question' element={<Question />} />
            <Route path='/Categories' element={< Categories/>} />
            <Route path='/Import' element={<Import/>} />
            <Route path='/Export' element={<Export/>} />
          </Route>
      </Route>
    </Routes>
  </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
