// src/components/Header.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

// Υποθετικά components/εικονίδια
const MenuIcon = () => <div className="icon menu-icon">☰</div>;
const HeartIcon = () => <div className="icon heart-icon">Favorites</div>;


const AvatarIcon = ({ imageUrl, initial }) => (
  <div className="icon avatar-icon">
    {imageUrl ? (
      <img src={imageUrl} alt="User Avatar" />
    ) : (
      <span>{initial}</span>
    )}
  </div>
);

// ΑΛΛΑΓΗ 1: Το Header τώρα δέχεται το onMenuToggle ως prop
const Header = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    // 🧹 Καθαρίζουμε ό,τι αφορά τον χρήστη
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');

    // Κλείνουμε το dropdown
    setIsDropdownOpen(false);

    // Πηγαίνουμε πίσω στην σελίδα welcome/login
    navigate('/');
  };

  // --- ΑΛΛΑΓΗ: Πλοήγηση στα Favorites ---
  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="app-header">
      {/* 1. Αριστερό Μέρος: Κουμπί Side Menu */}
      <button
        className="header-button menu-button"
        // ΑΛΛΑΓΗ 2: Αντικατάσταση της handleMenuClick με το onMenuToggle prop
        onClick={onMenuToggle}
        aria-label="Άνοιγμα μενού πλοήγησης"
      >
        <MenuIcon />
      </button>

      {/* 2. Κέντρο: Logo της Εφαρμογής */}
      <div className="header-logo">
        CineEuxoulides
      </div>

      {/* 3. Δεξιό Μέρος: Αγαπημένα και Avatar */}
      <div className="right-group">
        {/* Κουμπί Αγαπημένα */}
        <button
          className="header-button favorites-button"
          onClick={handleFavoritesClick}
          aria-label="Αγαπημένα"
        >
          <HeartIcon />
        </button>

        {/* Κουμπί Avatar Χρήστη */}
        <div className="user-avatar-container">
          <button
            className="header-button avatar-button"
            onClick={toggleDropdown}
            aria-label="Μενού χρήστη"
          >
            <AvatarIcon initial="U" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#profile">Προφίλ</a>
              <a href="#account">Λογαριασμός</a>
              <a href="#logout" onClick={handleLogout}>Αποσύνδεση</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;