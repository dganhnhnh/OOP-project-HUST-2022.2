import { useState, useEffect, useRef } from "react";
import { FaCog, FaTimes } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "./PopUpMenu.css";

function PopUpMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div
        className="popup-background"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={closeMenu}
      ></div>
      <div className="popup-container" ref={popupRef}>
        <div className="popup-btn" onClick={toggleMenu}>
          <FaCog color="blue" />
          <FiChevronDown style={{ fontSize: "17px" }} />
        </div>
        {isOpen && (
          <div className="popup-menu">
            <div className="popup-header">
              <h3>Question Bank</h3>
              <div className="popup-close" onClick={closeMenu}>
                <FaTimes />
              </div>
            </div>
            <div className="popup-items">
              <NavLink to="/Question" onClick={closeMenu} className="popup-item">
              Questions
            </NavLink>

            <NavLink to="/Categories" onClick={closeMenu} className="popup-item">
              Categories
            </NavLink>

            <NavLink to="/Import" onClick={closeMenu} className="popup-item">
              Import
            </NavLink>

            <NavLink to="/Export" onClick={closeMenu} className="popup-item">
              Export
            </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PopUpMenu;
