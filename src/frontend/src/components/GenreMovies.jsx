// src/components/GenreMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Χρησιμοποιούμε το TrendingSection.css για να έχουμε κοινό στυλ
import './TrendingSection.css';

const GenreMovies = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=el-GR&sort_by=popularity.desc`;

    fetch(url)
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.error("Error:", err));
  }, [genreId]);

  return (
    <div className="trending-section">

      {/* Κουμπί επιστροφής */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/movies" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
           ← Πίσω στις Κατηγορίες
        </Link>
      </div>

      <h2 style={{ color: 'white', borderLeft: '5px solid #fbbf24', paddingLeft: '15px' }}>
        Ταινίες Κατηγορίας
      </h2>

      {/* Grid Container */}
      <div className="movies-row">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="movie-card-link"
          >
            <div className="movie-card">

              {/* 1. Η Εικόνα */}
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                alt={movie.title}
                className="movie-poster"
              />

              {/* 2. ΤΟ OVERLAY (ΙΔΙΟ ΜΕ ΤΗΝ ΑΡΧΙΚΗ) */}
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
    </div>
  );
};

export default GenreMovies;