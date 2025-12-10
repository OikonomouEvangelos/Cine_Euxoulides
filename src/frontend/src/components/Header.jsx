// src/components/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import './Header.css';

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

const Header = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="app-header">
      {/* 1. Left: Menu Button */}
      <button
        className="header-button menu-button"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
      >
        <MenuIcon />
      </button>

      {/* 2. Center: Logo */}
      <div className="header-logo">
        {/* Link Logo to Home */}
        <Link to="/browse" style={{ textDecoration: 'none', color: 'inherit' }}>
            CineEuxoulides
        </Link>
      </div>

      {/* 3. Right: Favorites & Avatar */}
      <div className="right-group">

        {/* --- FAVORITES BUTTON CHANGED TO LINK --- */}
        <Link
          to="/favorites"
          className="header-button favorites-button"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          aria-label="Favorites"
        >
          <HeartIcon />
        </Link>

        {/* Avatar Button */}
        <div className="user-avatar-container">
          <button
            className="header-button avatar-button"
            onClick={toggleDropdown}
            aria-label="User menu"
          >
            <AvatarIcon initial="U" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#profile">Profile</a>
              <a href="#account">Account</a>
              <a href="#logout">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;