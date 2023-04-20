import React from 'react'
import './Navigation.css';
import { Outlet, NavLink, useLocation } from "react-router-dom";

const Navigation = () => {
    const location = useLocation();
  return (
    <>
    <div className ='Navigation'>
        <div className='nav-bar'>
      <NavLink to='/Question' className={`nav-item ${location.pathname === '/Question' ? 'activelink' : ''}`}>
        Questions
      </NavLink>
      <NavLink to='/Categories' className={`nav-item ${location.pathname === '/Categories' ? 'activelink' : ''}`}>
        Categories
      </NavLink>
      <NavLink to='/Import' className={`nav-item ${location.pathname === '/Import' ? 'activelink' : ''}`}>
        Import
      </NavLink>
      <NavLink to='/Export' className={`nav-item ${location.pathname === '/Export' ? 'activelink' : ''}`}>
        Export
      </NavLink>
        </div>
        <Outlet/>
    </div>
    </>
  )
}

export default Navigation