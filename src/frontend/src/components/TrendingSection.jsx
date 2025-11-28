// src/components/TrendingSection.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrendingSection.css';

const TrendingSection = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ΣΗΜΕΙΟ ΑΛΛΑΓΗΣ ---
  // ΣΒΗΣΕ τα γράμματα "TMDB_API_KEY" και βάλε τον πραγματικό, μακρύ κωδικό σου.
  // Πρέπει να είναι κάπως έτσι: const API_KEY = "a1b2c3d4e5f6...";
  // Αλλαγή της γραμμής του κλειδιού:
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ΔΙΟΡΘΩΣΗ: Εδώ χρησιμοποιούμε το API_KEY που ορίσαμε παραπάνω
        const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=el-GR`;

        console.log("Fetching URL:", url); // Δες την κονσόλα (F12) αν βγάλει λάθος

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setMovies(data.results);

      } catch (e) {
        console.error("Could not fetch trending movies:", e);
        setError("Αδυναμία φόρτωσης των ταινιών. Δοκιμάστε ξανά αργότερα.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []); // Το [] σημαίνει ότι τρέχει μόνο μία φορά

  if (isLoading) {
    return <div className="trending-section loading"><p>Φόρτωση ταινιών...</p></div>;
  }

  if (error) {
    return <div className="trending-section error"><p style={{ color: '#192129' }}>{error}</p></div>;
  }

  if (movies.length === 0) {
    return <div className="trending-section empty"><p>Δεν βρέθηκαν δημοφιλείς ταινίες αυτή τη στιγμή.</p></div>;
  }

  return (
    <div className="trending-section">
      <h2>{title || 'Τάσεις Τώρα'}</h2>

      <div className="movies-row">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card">

              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                alt={movie.title}
                className="movie-poster"
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>⭐️ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;