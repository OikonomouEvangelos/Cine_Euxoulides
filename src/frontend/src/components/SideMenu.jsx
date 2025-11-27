import React from 'react';
import './SideMenu.css'; // Import the CSS for styling

// SideMenu component that receives 'isOpen' and 'onClose' props
const SideMenu = ({ isOpen, onClose }) => {
  // Determine the CSS class based on the isOpen prop
  const menuClass = isOpen ? 'sidemenu open' : 'sidemenu';

  return (
    <div className={menuClass}>
      <button className="sidemenu-close-btn" onClick={onClose}>
        &times; {/* HTML entity for a multiplication sign (used as an 'X' for close) */}
      </button>
      <nav className="sidemenu-nav">
        <ul>
          <li><a href="#home" onClick={onClose}>Αρχική</a></li>
          <li><a href="#movies" onClick={onClose}>Ταινίες</a></li>
          <li><a href="#actors" onClick={onClose}>Ηθοποιοί</a></li>
          <li><a href="#directors" onClick={onClose}>Σκηνοθέτες</a></li>
          <li><a href="#date" onClick={onClose}>Χρονολολία</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;