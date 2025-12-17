// src/components/MovieRow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuthHeaders } from '../services/auth'; // Import για το Token
import './MovieRow.css';

// ΣΗΜΑΝΤΙΚΟ: Εισάγουμε το CSS που περιέχει το στυλ για το overlay
import './TrendingSection.css';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];

        // ΕΛΕΓΧΟΣ: Είναι URL του TMDB ή του δικού μας Backend;
        if (fetchUrl.includes('api.themoviedb.org')) {
            // Λογική για εξωτερικό TMDB API (Υπάρχουσα)
            const request = await fetch(`${fetchUrl}&api_key=${API_KEY}&language=el-GR`);
            const jsonData = await request.json();
            data = jsonData.results;
        } else {
            // Λογική για το δικό μας Backend (Recommendations)
            // Πρέπει να στείλουμε το Token!
            const request = await fetch(fetchUrl, {
                headers: getAuthHeaders()
            });
            if (request.ok) {
                // Το Backend επιστρέφει απευθείας λίστα (Array), όχι { results: ... }
                data = await request.json();
            }
        }

        if (data && Array.isArray(data)) {
            setMovies(data);
        }
      } catch (error) {
        console.error("Failed to fetch movies for row:", title, error);
      }
    };

    if (fetchUrl) {
        fetchData();
    }
  }, [fetchUrl, API_KEY]);

  // Κύλιση με τα βελάκια (Ίδια λογική)
  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Αν δεν υπάρχουν ταινίες (π.χ. χρήστης αποσυνδεδεμένος ή άδεια λίστα), κρύψε τη σειρά
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-row">
      {/* Τίτλος με το κίτρινο border (αν θες να ταιριάζει με τα άλλα) */}
      <h2 style={{ borderLeft: '5px solid #fbbf24', paddingLeft: '15px' }}>
        {title}
      </h2>

      <div className="row-wrapper">
        <button className="handle left-handle" onClick={() => scroll('left')}>‹</button>

        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (

            // ΕΔΩ ΕΒΑΛΑ ΤΟΝ ΚΩΔΙΚΑ ΓΙΑ ΤΗΝ ΚΑΡΤΑ ΜΕ ΤΟ OVERLAY
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card-link"
              // Προσθέτουμε λίγο margin αν χρειάζεται για να μην κολλάνε στο scroll
              style={{ minWidth: '220px', marginRight: '15px' }}
            >
              <div className="movie-card">

                {/* 1. Εικόνα */}
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                  alt={movie.title}
                  className="movie-poster"
                />

                {/* 2. ΤΟ ΜΠΛΕ OVERLAY */}
                <div className="movie-overlay">
                  <div className="overlay-stars">
                     ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                     <span className="vote-count"> ({movie.vote_count})</span>
                  </div>
                  <div className="overlay-title">{movie.title}</div>
                </div>

              </div>
            </Link>

          ))}
        </div>

        <button className="handle right-handle" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
};

export default MovieRow;