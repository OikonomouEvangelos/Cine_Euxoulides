// src/components/TrendingSection.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TrendingSection.css';

const TrendingSection = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Ref για το container που θα "πιάνει" το ποντίκι
  const containerRef = useRef(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // 1. Λήψη Ταινιών
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      if (!API_KEY) return;
      try {
        const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=el-GR`;
        const response = await fetch(url);
        const data = await response.json();
        setMovies(data.results.slice(0, 15));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrendingMovies();
  }, [API_KEY]);

  // 2. ΤΟ ΑΠΟΛΥΤΟ ΚΛΕΙΔΩΜΑ ΤΟΥ SCROLL
  useEffect(() => {
    const element = containerRef.current;

    // Αν δεν έχει φορτώσει ακόμα το στοιχείο, σταματάμε
    if (!element) return;

    const handleWheel = (e) => {
      // ΑΥΤΟ ΕΙΝΑΙ ΤΟ ΚΛΕΙΔΙ: Σταματάει τη σελίδα από το να κουνηθεί
      e.preventDefault();
      e.stopPropagation();

      // Αλλάζει τη γωνία του γραναζιού
      const delta = e.deltaY / 4;
      setRotation((prev) => prev - delta);
    };

    // Προσθέτουμε τον listener "χειροκίνητα" με { passive: false }
    // Αυτό λέει στον browser: "Περίμενε να σου πω αν θα σκρολάρεις ή όχι"
    element.addEventListener('wheel', handleWheel, { passive: false });

    // Καθαρισμός όταν φεύγουμε
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [isLoading]); // Το ξανατρέχουμε μόλις τελειώσει το loading


  return (
    // Συνδέουμε το ref στο εξωτερικό div
    <div className="trending-section" ref={containerRef}>
      <h2>{title || 'Τάσεις Τώρα'}</h2>

      {isLoading ? (
        <div className="loading-container"><p>Loading...</p></div>
      ) : (
        <div className="scene">
          <div
            className="carousel-cylinder"
            style={{ transform: `translateZ(-500px) rotateY(${rotation}deg)` }}
          >
            {movies.map((movie, index) => {
              const totalMovies = movies.length;
              const anglePerMovie = 360 / totalMovies;
              const cardAngle = anglePerMovie * index;

              return (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className="movie-card-link"
                  style={{
                    transform: `rotateY(${cardAngle}deg) translateZ(500px)`
                  }}
                  draggable="false"
                >
                  <div className="movie-card">
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                      alt={movie.title}
                      className="movie-poster"
                      draggable="false"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingSection;