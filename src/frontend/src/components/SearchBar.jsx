
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './SearchBar.css';

const SearchIcon = () => <div className="search-icon">🔍</div>;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault(); // Αποτρέπει το reload της σελίδας

    const trimmed = searchTerm.trim();
      if (!trimmed) return;

    console.log('Εκτέλεση αναζήτησης για:',  trimmed);

      navigate(`/search?q=${encodeURIComponent(trimmed)}`); // Πήγαινε στη σελίδα αναζήτησης με παράμετρο q


  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Αναζήτηση ταινιών, σειρών..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
        aria-label="Πεδίο αναζήτησης περιεχομένου"
      />


      <button type="submit" className="search-button" aria-label="Αναζήτηση">
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchBar;