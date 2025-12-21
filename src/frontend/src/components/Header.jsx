import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FriendsModal from './FriendsModal';
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
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOpenFriends = (e) => {
    e.preventDefault();
    setIsFriendsOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="app-header">
        {/* Left: Menu */}
        <button className="header-button menu-button" onClick={onMenuToggle}>
          <MenuIcon />
        </button>

        {/* --- Center: Logo (SECRET LINK) --- */}
        {/* Keeps original styling, but links to 3D world */}
        <Link to="/3d-favorites" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="header-logo" style={{ cursor: 'pointer' }}>
                CineEuxoulides
            </div>
        </Link>

        {/* Right: Icons */}
        <div className="right-group">
            <button
              className="header-button favorites-button"
              onClick={handleFavoritesClick}
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
                    <a href="#friends" onClick={handleOpenFriends}>👥 Φίλοι & Αιτήματα</a>
                    <a href="#account">⚙️ Λογαριασμός</a>
                    <div className="dropdown-divider"></div>
                    <a href="#logout" onClick={handleLogout} className="logout-link">🚪 Αποσύνδεση</a>
                </div>
                )}
            </div>
        </div>
      </header>

      {/* Friends Modal */}
      {isFriendsOpen && <FriendsModal onClose={() => setIsFriendsOpen(false)} />}
    </>
  );
};

export default Header;