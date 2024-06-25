// src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">ZCoder</div>
        <div className="footer-links">
          <Link to="/home" className="footer-link">Home</Link>
          <Link to="/profile" className="footer-link">Profile</Link>
          <Link to="/contests" className="footer-link">Contests</Link>
          <Link to="/rooms" className="footer-link">Rooms</Link>
          <Link to="/code-editor" className="footer-link">Code Editor</Link>
        </div>
        <div className="footer-socials">
          <a href="https://facebook.com" className="footer-social" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" className="footer-social" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" className="footer-social" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" className="footer-social" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} ZCoder. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
