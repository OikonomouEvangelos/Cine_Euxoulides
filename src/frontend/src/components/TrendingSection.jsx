// src/components/TrendingSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrendingSection.css';

// ΥΠΟΘΕΤΙΚΗ ΣΤΑΘΕΡΑ: Αντικαταστήστε με το πραγματικό URL του backend σας
const TRENDING_API_URL = '/api/movies/trending';

const TrendingSection = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ΛΟΓΙΚΗ ΑΣΥΓΧΡΟΝΗΣ ΚΛΗΣΗΣ API ---
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setIsLoading(true); // Ξεκινάμε τη φόρτωση
        setError(null);    // Καθαρίζουμε τυχόν προηγούμενα σφάλματα

        // 1. Εκτέλεση της κλήσης API
        const response = await fetch(TRENDING_API_URL);

        // Έλεγχος για σφάλματα HTTP (π.χ. 404, 500)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 2. Ανάλυση των δεδομένων JSON
        const data = await response.json();

        // 3. Ενημέρωση της κατάστασης (state) με τις ταινίες
        setMovies(data.trendingMovies || data); // Υποθέτουμε ότι τα δεδομένα είναι είτε απευθείας array είτε έχουν key 'trendingMovies'

      } catch (e) {
        console.error("Could not fetch trending movies:", e);
        setError("Αδυναμία φόρτωσης των ταινιών. Δοκιμάστε ξανά αργότερα.");
      } finally {
        setIsLoading(false); // Τελειώνουμε τη φόρτωση
      }
    };

    fetchTrendingMovies();
  }, []); // Το άδειο array ([]) εξασφαλίζει ότι το useEffect τρέχει μόνο μία φορά (στο mount)

  // --- RENDERING ΒΑΣΕΙ ΚΑΤΑΣΤΑΣΗΣ ---

  if (isLoading) {
    return <div className="trending-section loading"><p>Φόρτωση ταινιών...</p></div>;
  }

  if (error) {
    return <div className="trending-section error"><p style={{ color: '#192129' }}>{error}</p></div>;
  }

  if (movies.length === 0) {
    return <div className="trending-section empty"><p>Δεν βρέθηκαν δημοφιλείς ταινίες αυτή τη στιγμή.</p></div>;
  }

  // --- ΚΑΝΟΝΙΚΟ RENDERING ---
  return (
    <div className="trending-section">
      <h2>{title || 'Τάσεις Τώρα'}</h2>

      <div className="movies-row">
        {movies.map((movie) => (
          // ΣΗΜΕΙΩΣΗ: Υποθέτουμε ότι κάθε αντικείμενο 'movie' έχει id, title, rating και image
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card">
              {/* Χρησιμοποιήστε το πραγματικό URL εικόνας από το API */}
              <img src={movie.image} alt={movie.title} className="movie-poster" />

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>⭐️ {movie.rating}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;