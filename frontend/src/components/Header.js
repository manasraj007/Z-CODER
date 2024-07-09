// src/components/Header.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-logo">ZCoder</div>
      <nav className="navbar">
        <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>Home</Link>
        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
        <Link to="/Questions" className={`nav-link ${location.pathname === '/Questions' ? 'active' : ''}`}>Questions</Link>
        <Link to="/contests" className={`nav-link ${location.pathname === '/contests' ? 'active' : ''}`}>Calender</Link>
        <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>Rooms</Link>
        <Link to="/code-editor" className={`nav-link ${location.pathname === '/code-editor' ? 'active' : ''}`}>Code Editor</Link>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Logout</Link>
      </nav>
    </header>
  );
}

export default Header;
