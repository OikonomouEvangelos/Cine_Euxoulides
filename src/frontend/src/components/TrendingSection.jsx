// src/components/TrendingSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TrendingCarousel.css'; // <--- ΠΡΟΣΟΧΗ: Κάνουμε import το ΝΕΟ css

const TrendingSection = () => {
  const [movies, setMovies] = useState([]);
  const [rotation, setRotation] = useState(0); // Η γωνία περιστροφής του καρουζέλ

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    // Φέρνουμε μόνο 8-10 ταινίες για να μην γίνει βαρύ το 3D
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=el-GR`)
      .then(res => res.json())
      .then(data => setMovies(data.results.slice(0, 9)))
      .catch(err => console.error(err));
  }, []);

  // Λογική Περιστροφής
  const nextSlide = () => {
    setRotation(rotation - (360 / movies.length));
  };

  const prevSlide = () => {
    setRotation(rotation + (360 / movies.length));
  };

  // Ακτίνα του κύκλου (πόσο μακριά είναι οι κάρτες από το κέντρο)
  const radius = 350;

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Trending Now</h2>

      <div
        className="carousel-container"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {movies.map((movie, index) => {
          // Υπολογισμός γωνίας για κάθε κάρτα
          const angle = (360 / movies.length) * index;

          return (
            <div
              className="carousel-item"
              key={movie.id}
              style={{
                // Εδώ γίνεται η μαγεία του 3D:
                // 1. Γυρνάμε την κάρτα στη γωνία της (rotateY)
                // 2. Την σπρώχνουμε προς τα έξω (translateZ)
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`
              }}
            >
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="carousel-poster"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Κουμπιά για να γυρνάει */}
      <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
      <button className="carousel-btn next" onClick={nextSlide}>❯</button>

    </div>
  );
};

export default TrendingSection;