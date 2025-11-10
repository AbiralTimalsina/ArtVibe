import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand Name */}
        <div className="nav-logo">
          <h2>ArtVibe</h2>
        </div>

        {/* Navigation Links */}
        <ul className={nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}}>
          <li className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="/gallery" className="nav-link">Gallery</a>
          </li>
          <li className="nav-item">
            <a href="/artists" className="nav-link">Artists</a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">Contact</a>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="nav-auth">
          <button className="btn-login">Login</button>
          <button className="btn-signup">Sign Up</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;