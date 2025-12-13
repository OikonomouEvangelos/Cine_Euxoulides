// src/components/Header.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendsModal from './FriendsModal'; // <-- IMPORT ΤΟ ΝΕΟ MODAL
import './Header.css';

const MenuIcon = () => <div className="icon menu-icon">☰</div>;
const HeartIcon = () => <div className="icon heart-icon">Favorites</div>;

const AvatarIcon = ({ imageUrl, initial }) => (
  <div className="icon avatar-icon">
    {imageUrl ? <img src={imageUrl} alt="Avatar" /> : <span>{initial}</span>}
  </div>
);

const Header = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false); // <-- STATE ΓΙΑ ΤΟ MODAL ΦΙΛΩΝ

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    // localStorage.removeItem('userId'); // Αν το αποθηκεύεις, καθάρισέ το κι αυτό
    setIsDropdownOpen(false);
    navigate('/');
  };

// --- ΑΛΛΑΓΗ: Πλοήγηση στα Favorites (Από Favorites-Kouts) ---
  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  // --- Dropdown Toggle (Συνδυασμένο) ---
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // --- ΑΝΟΙΓΜΑ ΦΙΛΩΝ (Από develop) ---
  const handleOpenFriends = (e) => {
    e.preventDefault();
    setIsFriendsOpen(true);   // Ανοίγει το Modal
    setIsDropdownOpen(false); // Κλείνει το Dropdown
  };

  return (
    <>
      <header className="app-header">
        {/* Αριστερά: Menu */}
        <button className="header-button menu-button" onClick={onMenuToggle}>
          <MenuIcon />
        </button>

        {/* Κέντρο: Logo */}
        <div className="header-logo">CineEuxoulides</div>

        {/* Δεξιά: Εικονίδια */}
        <div className="right-group">


        <button
          className="header-button favorites-button"
          onClick={handleFavoritesClick} //
        >
          <HeartIcon />
        </button>

          {/* AVATAR + DROPDOWN */}
          <div className="user-avatar-container">
            <button className="header-button avatar-button" onClick={toggleDropdown}>
              <AvatarIcon initial="U" />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a href="#profile">👤 Προφίλ</a>
                {/* ΝΕΑ ΕΠΙΛΟΓΗ ΦΙΛΩΝ */}
                <a href="#friends" onClick={handleOpenFriends}>👥 Φίλοι & Αιτήματα</a>
                <a href="#account">⚙️ Λογαριασμός</a>
                <div className="dropdown-divider"></div>
                <a href="#logout" onClick={handleLogout} className="logout-link">🚪 Αποσύνδεση</a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ΕΜΦΑΝΙΣΗ MODAL ΑΝ ΕΙΝΑΙ TRUE */}
      {isFriendsOpen && <FriendsModal onClose={() => setIsFriendsOpen(false)} />}
    </>
  );
};

export default Header;