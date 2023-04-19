import React, { Children } from "react";
import {Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './component/Navbar';
function App() {
  return (
    <>
      <div className="App">
        <Header />
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}

export default App;
