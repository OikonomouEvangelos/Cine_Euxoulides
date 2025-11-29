// src/frontend/src/components/GenreMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TrendingSection.css';

const GenreMovies = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);

  // Τραβάει το κλειδί από το .env αρχείο που φτιάξαμε πριν
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=el-GR&sort_by=popularity.desc`;

    fetch(url)
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.error("Error:", err));
  }, [genreId]);

  return (
    <div className="trending-section" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <Link to="/movies" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.1rem' }}>
           ← Πίσω στις Κατηγορίες
        </Link>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Ταινίες Κατηγορίας</h2>

      <div className="movies-row" style={{ flexWrap: 'wrap', justifyContent: 'center', overflow: 'visible' }}>
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card" style={{ marginBottom: '30px', margin: '15px' }}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                alt={movie.title} className="movie-poster"
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

export default GenreMovies;