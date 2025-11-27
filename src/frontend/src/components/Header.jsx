// src/components/Header.jsx

import React, { useState } from 'react';
import './Header.css';

// Υποθετικά components/εικονίδια
// Στην πραγματικότητα, θα χρησιμοποιούσατε μια βιβλιοθήκη όπως react-icons
const MenuIcon = () => <div className="icon menu-icon">☰</div>;
const HeartIcon = () => <div className="icon heart-icon">❤️</div>;

// Το AvatarIcon τώρα θα μπορεί να δείχνει είτε εικόνα είτε αρχικό γράμμα
const AvatarIcon = ({ imageUrl, initial }) => (
  <div className="icon avatar-icon">
    {imageUrl ? (
      <img src={imageUrl} alt="User Avatar" />
    ) : (
      <span>{initial}</span>
    )}
  </div>
);

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMenuClick = () => {
    console.log('Άνοιγμα Side Menu...');
  };

  const handleFavoritesClick = () => {
    console.log('Προβολή Αγαπημένων...');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="app-header">
      {/* 1. Αριστερό Μέρος: Κουμπί Side Menu */}
      <button
        className="header-button menu-button"
        onClick={handleMenuClick}
        aria-label="Άνοιγμα μενού πλοήγησης"
      >
        <MenuIcon />
      </button>

      {/* 2. Κέντρο: Logo της Εφαρμογής */}
      <div className="header-logo">
        {/* Αφαίρεσα τα ** γιατί δεν είναι μέρος του JSX και εμφανίζονται ως κείμενο */}
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
            {/* Παράδειγμα: χρήση ενός αρχικού γράμματος (π.χ. 'U' για User) */}
            <AvatarIcon initial="U" />
            {/* Ή αν έχετε URL εικόνας: <AvatarIcon imageUrl="https://via.placeholder.com/32" /> */}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#profile">Προφίλ</a>
              <a href="#account">Λογαριασμός</a>
              <a href="#logout">Αποσύνδεση</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;