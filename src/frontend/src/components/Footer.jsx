// src/components/Footer.jsx

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>CineEuxoulides Info</h4>
          <ul>
            <li><a href="#about">Σχετικά με εμάς</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Υποστήριξη</h4>
          <ul>
            <li><a href="#contact">Επικοινωνία</a></li>
            <li><a href="#preferences">Προτιμήσεις Cookies</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Περιήγηση</h4>
          <ul>
            <li><a href="#terms">Όροι Χρήσης</a></li>
            <li><a href="#privacy">Πολιτική Απορρήτου</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Κοινωνικά Δίκτυα</h4>
          <ul>
            <li><a href="https://github.com/OikonomouEvangelos/Cine_Euxoulides">GitHub</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CineEuxoulides. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;