// src/components/GenreMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ΔΕΝ κάνουμε import κανένα CSS για να μην γίνονται συγκρούσεις

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

  // --- ΣΤΥΛ (Καρφωτά εδώ για να μην χαλάσει τίποτε άλλο) ---

  // Το κουτί της κάθε ταινίας
  const cardStyle = {
    width: '200px',              // Σταθερό πλάτος (για να μην είναι τεράστιες)
    backgroundColor: '#222',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Η κίνηση του hover
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
  };

  // Η εικόνα της ταινίας
  const imgStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block'
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>

      {/* Κουμπί Πίσω */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/movies" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
           ← Πίσω
        </Link>
      </div>

      <h2 style={{ color: 'white', borderLeft: '5px solid #fbbf24', paddingLeft: '15px' }}>
        Ταινίες Κατηγορίας
      </h2>

      {/* Η Λίστα με τις ταινίες */}
      <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          justifyContent: 'center',
          paddingTop: '20px'
      }}>
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <div
                className="hover-card" // Χρησιμοποιούμε μια απλή κλάση για το hover
                style={cardStyle}
                // Εδώ ορίζουμε τι γίνεται όταν περνάει το ποντίκι (Inline Hover Logic)
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.zIndex = '10';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(251, 191, 36, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.zIndex = '1';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
                }}
            >
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
                alt={movie.title}
                style={imgStyle}
              />

              <div style={{ padding: '10px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '0.9rem', margin: '5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {movie.title}
                </h3>
                <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: 0, fontSize: '0.9rem' }}>
                    ⭐️ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
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