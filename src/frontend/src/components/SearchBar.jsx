import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios'; // Μην ξεχάσεις το import
import './SearchBar.css';

const SearchIcon = () => <div className="search-icon">🔍</div>;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState([]); // State για το ιστορικό
  const [showHistory, setShowHistory] = useState(false); // State για την εμφάνιση του dropdown
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Φέρνει το ιστορικό όταν ο χρήστης κάνει κλικ στο input
  const handleFocus = async () => {
    try {
      const token = localStorage.getItem('token');
      // Προσαρμογή του endpoint ανάλογα με το backend σου (χρήση port 8080)
      const response = await axios.get('http://localhost:8080/api/search/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
      setShowHistory(true);
    } catch (err) {
      console.error('Σφάλμα κατά την ανάκτηση ιστορικού:', err);
    }
  };

  const executeSearch = async (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    try {
      const token = localStorage.getItem('token');
      // Αποθήκευση της αναζήτησης στο backend
      await axios.post('http://localhost:8080/api/search/history',
        { query: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Σφάλμα κατά την αποθήκευση της αναζήτησης:', err);
    }

    console.log('Εκτέλεση αναζήτησης για:', trimmed);
    setShowHistory(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    executeSearch(searchTerm);
  };

  return (
    <div className="search-bar-wrapper" style={{ position: 'relative' }}>
      <form className="search-bar-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Αναζήτηση ταινιών, σειρών..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus} // Ενεργοποίηση ιστορικού
          onBlur={() => setTimeout(() => setShowHistory(false), 200)} // Κλείσιμο με καθυστέρηση για να προλάβει το κλικ
          className="search-input"
          aria-label="Πεδίο αναζήτησης περιεχομένου"
        />
        <button type="submit" className="search-button" aria-label="Αναζήτηση">
          <SearchIcon />
        </button>
      </form>

      {/* Dropdown Ιστορικού */}
      {showHistory && history.length > 0 && (
        <div className="search-history-dropdown">
          {history.map((item, index) => (
            <div
              key={index}
              className="history-item"
              onMouseDown={() => {
                setSearchTerm(item);
                executeSearch(item);
              }}
            >
              <span className="history-clock">🕒</span>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;