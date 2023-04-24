import React, { useState, useEffect, useRef } from 'react';
import { FaCog } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

function DropDownMenu() {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      setDropdownVisibility(false);
    }
  };

  const handleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  const handleHover = (value) => {
    setHovered(value);
  };

  return (
    <div ref={ref} className='dropdown-container'>
      <div className='dropdown-btn' onClick={handleDropdown}>
        <FaCog color='blue' />
        <FiChevronDown style={{ fontSize: '17px' }} />
      </div>
      {isDropdownVisible && (
        <div
          className='dropdown'
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
        >
          <div className='dropdown-section'>
            Question Bank
          </div>
          {isHovered && (
            <div className='dropdown-menu'>
              <NavLink to='/Question' className='dropdown-item'>
                Questions
              </NavLink>
              <NavLink to='/Categories' className='dropdown-item'>
                Categories
              </NavLink>
              <NavLink to='/Import' className='dropdown-item'>
                Import
              </NavLink>
              <NavLink to='/Export' className='dropdown-item'>
                Export
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
