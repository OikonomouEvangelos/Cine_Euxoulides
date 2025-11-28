// src/components/SideMenu.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';

const SideMenu = ({ isOpen, onClose }) => {
  // --- States για το άνοιγμα/κλείσιμο των υπο-μενού ---
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isActorsOpen, setIsActorsOpen] = useState(false);
  const [isDirectorsOpen, setIsDirectorsOpen] = useState(false);
  const [isYearsOpen, setIsYearsOpen] = useState(false); // ΝΕΟ: Για τη χρονολογία

  // State για τους Ηθοποιούς (που έρχονται από το API)
  const [topActors, setTopActors] = useState([]);

  const menuClass = isOpen ? 'sidemenu open' : 'sidemenu';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // --- 1. Fetch Popular Actors ---
  // Τρέχει μόνο μία φορά όταν φορτώνει το μενού
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const url = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=el-GR&page=1`;
        const res = await fetch(url);
        const data = await res.json();
        // Κρατάμε τους πρώτους 8 για να μην γεμίζει υπερβολικά το μενού
        setTopActors(data.results.slice(0, 8));
      } catch (err) {
        console.error("Error loading actors:", err);
      }
    };
    fetchActors();
  }, []);

  // --- 2. Δημιουργία Λίστας Ετών ---
  // Φτιάχνει δυναμικά μια λίστα με τα τελευταία 30 χρόνια
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(30), (val, index) => currentYear - index);

  // --- 3. Σταθερά Δεδομένα ---
  const famousDirectors = [
    { id: 525, name: "Christopher Nolan" },
    { id: 109533, name: "Yorgos Lanthimos" },
    { id: 138, name: "Quentin Tarantino" },
    { id: 488, name: "Steven Spielberg" },
    { id: 1032, name: "Martin Scorsese" },
    { id: 17163, name: "Denis Villeneuve" },
    { id: 28974, name: "Greta Gerwig" }
  ];

  const genres = [
    { id: 28, name: "Δράση" }, { id: 35, name: "Κωμωδία" },
    { id: 27, name: "Τρόμου" }, { id: 10749, name: "Ρομαντικές" },
    { id: 878, name: "Sci-Fi" }, { id: 53, name: "Θρίλερ" },
    { id: 18, name: "Δράμα" }, { id: 16, name: "Animation" }
  ];

  // --- Toggle Functions (Ανοίγουν/Κλείνουν τα ακορντεόν) ---
  const toggleMovies = (e) => { e.preventDefault(); setIsMoviesOpen(!isMoviesOpen); };
  const toggleActors = (e) => { e.preventDefault(); setIsActorsOpen(!isActorsOpen); };
  const toggleDirectors = (e) => { e.preventDefault(); setIsDirectorsOpen(!isDirectorsOpen); };
  const toggleYears = (e) => { e.preventDefault(); setIsYearsOpen(!isYearsOpen); };

  return (
    <div className={menuClass}>
      <button className="sidemenu-close-btn" onClick={onClose}>&times;</button>

      <nav className="sidemenu-nav">
        <ul>
          {/* ΑΡΧΙΚΗ */}
          <li><Link to="/" onClick={onClose}>Αρχική</Link></li>

          {/* --- ΤΑΙΝΙΕΣ (Accordion) --- */}
          <li>
            <a href="#" onClick={toggleMovies} className="submenu-toggle">
              Ταινίες <span className={`arrow ${isMoviesOpen ? 'up' : 'down'}`}>▼</span>
            </a>
            {isMoviesOpen && (
              <ul className="submenu-list">
                {genres.map(g => (
                  <li key={g.id}>
                    <Link to={`/movies/${g.id}`} onClick={onClose} className="submenu-item">{g.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* --- ΗΘΟΠΟΙΟΙ (Dynamic Accordion) --- */}
          <li>
            <a href="#" onClick={toggleActors} className="submenu-toggle">
              Ηθοποιοί <span className={`arrow ${isActorsOpen ? 'up' : 'down'}`}>▼</span>
            </a>
            {isActorsOpen && (
              <ul className="submenu-list">
                {topActors.length > 0 ? (
                  topActors.map(a => (
                    <li key={a.id}>
                      <Link to={`/actors/${a.id}`} onClick={onClose} className="submenu-item">{a.name}</Link>
                    </li>
                  ))
                ) : (
                  <li className="submenu-item">Φόρτωση...</li>
                )}
              </ul>
            )}
          </li>

          {/* --- ΣΚΗΝΟΘΕΤΕΣ (Static Accordion) --- */}
          <li>
            <a href="#" onClick={toggleDirectors} className="submenu-toggle">
              Σκηνοθέτες <span className={`arrow ${isDirectorsOpen ? 'up' : 'down'}`}>▼</span>
            </a>
            {isDirectorsOpen && (
              <ul className="submenu-list">
                {famousDirectors.map(d => (
                  <li key={d.id}>
                    <Link to={`/directors/${d.id}`} onClick={onClose} className="submenu-item">{d.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* --- ΧΡΟΝΟΛΟΓΙΑ (Generated Accordion) --- */}
          <li>
            <a href="#" onClick={toggleYears} className="submenu-toggle">
              Χρονολογία <span className={`arrow ${isYearsOpen ? 'up' : 'down'}`}>▼</span>
            </a>
            {isYearsOpen && (
              // Προσθέσαμε max-height και overflow για να μην πιάνει όλη την οθόνη
              <ul className="submenu-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {years.map(year => (
                  <li key={year}>
                    <Link to={`/year/${year}`} onClick={onClose} className="submenu-item">
                      {year}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;