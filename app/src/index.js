import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import MyCourses from './component/NavBar/MyCourses.js';
import Thicuoiki from './component/NavBar/Thicuoiki'
import Question from './component/Question/Question';
import Categories from './component/Category/Categories';
import Import from './component/DropDownMenu/Import';
import Export from './component/DropDownMenu/Export';
import EditQuestion from './component/Question/EditQuestion';
import AddNewQuestion from './component/Question/AddNewQuestion';
import QuizInterface from './component/Quiz/QuizInterface/QuizInterface';
import NewQuiz from './component/Quiz/AddNewQuiz/NewQuiz';
import EditingQuiz from './component/Quiz/EditingQuiz/EditingQuiz'
import QuestionBank from './component/Quiz/AddQuestion/QuestionBank/QuestionBank';
import ExistingCategory from './component/Quiz/AddQuestion/RandomQuestion/ExistingCategory';
import NewCategory from './component/Quiz/AddQuestion/RandomQuestion/NewCategory'
import PreviewQuiz from './component/Quiz/PreviewQuiz/PreviewQuiz';
import QuizResult from './component/Quiz/PreviewQuiz/QuizResult';
import ShuffleOptionContext from './component/Quiz/EditingQuiz/ShuffleOptionManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/MyCourses" replace />} />
        <Route exact path='/' element={<App />}>
          <Route path='/MyCourses/*' element={<MyCourses/>}/>
          <Route path="/MyCourses/QuizInterface" element={<QuizInterface />}/>
          <Route path="/MyCourses/QuizInterface/EditingQuiz" element={<EditingQuiz />}/>
          <Route path='/MyCourses/QuizInterface/PreviewQuiz' element={<PreviewQuiz/>} />
          <Route path='/MyCourses/QuizInterface/PreviewQuiz/QuizResult' element={<QuizResult/>} />
          <Route exact path='/QuestionBank' element={<QuestionBank />} />
          <Route exact path='/ExistingCategory' element={<ExistingCategory />} />
          <Route exact path='/NewCategory' element={<NewCategory />} />
          <Route exact path='/Thicuoiki' element={<Thicuoiki />} />

          <Route path='/MyCourses/Question/EditQuestion' element={<EditQuestion />} />
          <Route path='/MyCourses/Question/AddNewQuestion' element={<AddNewQuestion />} />
            <Route path='/MyCourses/Question' element={<Question />} />
            <Route path='/MyCourses/Categories' element={< Categories />} />
            <Route path='/MyCourses/Import' element={<Import />} />
            <Route path='/MyCourses/Export' element={<Export />} />
          <Route path='/MyCourses/Addnewquiz' element={<NewQuiz />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();