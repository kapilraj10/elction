import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">ललित चन्द</span>
          <span className="logo-subtitle">राष्ट्रिय स्वतन्त्र पार्टी</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className={`navbar-link ${isActive('/')}`} onClick={closeMenu}>
            गृहपृष्ठ
          </Link>
          <Link to="/about" className={`navbar-link ${isActive('/about')}`} onClick={closeMenu}>
            हाम्रो बारेमा
          </Link>
          <Link to="/news-media" className={`navbar-link ${isActive('/news-media')}`} onClick={closeMenu}>
            समाचार र मिडिया
          </Link>
          <Link to="/suggestions" className={`navbar-link ${isActive('/suggestions')}`} onClick={closeMenu}>
            सुझाव
          </Link>
          <Link to="/commitment" className={`navbar-link ${isActive('/commitment')}`} onClick={closeMenu}>
            प्रतिबद्धता
          </Link>
        </div>

        <button 
          className={`navbar-toggle ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
