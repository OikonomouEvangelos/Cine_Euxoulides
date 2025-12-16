// src/components/GenreMovies.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchBar from './SearchBar'; // Βεβαιώσου ότι είναι στον ίδιο φάκελο
import './MovieCard.css';
import MovieWheel from "./MovieWheel";


const GenreMovies = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);

  // Τραβάει το κλειδί από το .env
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    if (!API_KEY) return;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=el-GR&sort_by=popularity.desc`;

    fetch(url)
      .then(res => res.json())
      .then(data => setMovies(data.results || []))
      .catch(err => console.error("Error:", err));
  }, [genreId]);

  return (
    <div className="search-page" style={{ minHeight: '100vh', paddingTop: '20px' }}>

      {/* --- HEADER TOOLBAR (Back Button + Search) --- */}
      <div style={{
          display: 'flex',
          justifyContent: 'space-between', /* Σπρώχνει τα στοιχεία στις άκρες */
          alignItems: 'center',            /* Κεντράρισμα στον κάθετο άξονα */
          padding: '0 40px',               /* Κενό δεξιά-αριστερά */
          marginBottom: '30px'
      }}>

        {/* ΑΡΙΣΤΕΡΑ: Κουμπί Επιστροφής */}
        <Link to="/movies" style={{
            color: '#fbbf24',
            textDecoration: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
           <span>←</span> Πίσω στις Κατηγορίες
        </Link>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

          {/* Τροχός για την συγκεκριμένη κατηγορία */}
          <MovieWheel genreId={genreId} title="Δεν ξέρεις τι να δεις; " />
        </div>


        {/* ΔΕΞΙΑ: Μπάρα Αναζήτησης */}
        <div style={{ width: '400px' }}>
            <SearchBar />
        </div>


      </div>
      {/* --------------------------------------------- */}

      <h2 style={{ paddingLeft: '40px', color: 'white' }}>Ταινίες Κατηγορίας</h2>

      {/* GRID ΤΑΙΝΙΩΝ */}
      <div className="movies-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                alt={movie.title} className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-rating">
                  ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenreMovies;