import React from 'react'
import './Navigation.css';
import { Outlet, NavLink, useLocation } from "react-router-dom";

const Navigation = () => {
    const location = useLocation();
  return (
    <>
    <div className ='Navigation'>
        <div className='nav-bar'>
      <NavLink to='/MyCourses/Question' className={`nav-item ${location.pathname === '/MyCourses/Question' ? 'activelink' : ''}`}>
        Questions
      </NavLink>
      <NavLink to='/MyCourses/Categories' className={`nav-item ${location.pathname === '/MyCourses/Categories' ? 'activelink' : ''}`}>
        Categories
      </NavLink>
      <NavLink to='/MyCourses/Import' className={`nav-item ${location.pathname === '/MyCourses/Import' ? 'activelink' : ''}`}>
        Import
      </NavLink>
      <NavLink to='/MyCourses/Export' className={`nav-item ${location.pathname === '/MyCourses/Export' ? 'activelink' : ''}`}>
        Export
      </NavLink>
        </div>
    </div>
    </>
  )
}

export default Navigation