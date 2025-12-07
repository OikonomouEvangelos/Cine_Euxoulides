// src/components/TrendingSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrendingCarousel.css';

const TrendingSection = () => {
  const [movies, setMovies] = useState([]);
  const [rotation, setRotation] = useState(0);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    // Φέρνουμε 9 ταινίες
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=el-GR`)
      .then(res => res.json())
      .then(data => setMovies(data.results.slice(0, 9)))
      .catch(err => console.error(err));
  }, []);

  const nextSlide = () => {
    setRotation(rotation - (360 / movies.length));
  };

  const prevSlide = () => {
    setRotation(rotation + (360 / movies.length));
  };

  const radius = 350;

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Trending Now</h2>

      <div
        className="carousel-container"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {movies.map((movie, index) => {
          const angle = (360 / movies.length) * index;

          return (
            <div
              className="carousel-item"
              key={movie.id}
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`
              }}
            >
              <Link to={`/movie/${movie.id}`} className="carousel-link">

                {/* 1. Η ΕΙΚΟΝΑ */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="carousel-poster"
                />

                {/* 2. ΤΟ ΜΠΛΕ LAYER (OVERLAY) */}
                <div className="carousel-overlay">
                  <div className="overlay-stars">
                    {/* Βαθμολογία */}
                    ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}

                    {/* Αριθμός Ψήφων (ΝΕΑ ΠΡΟΣΘΗΚΗ) */}
                    <span className="vote-count"> ({movie.vote_count})</span>
                  </div>

                  <div className="overlay-title">{movie.title}</div>
                </div>

              </Link>
            </div>
          );
        })}
      </div>

      <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
      <button className="carousel-btn next" onClick={nextSlide}>❯</button>

    </div>
  );
};

export default TrendingSection;