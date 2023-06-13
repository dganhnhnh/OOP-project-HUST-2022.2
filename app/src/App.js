import {Outlet } from 'react-router-dom';
import Header from './component/Header';
import Navbar from './component/NavBar/Navbar';

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