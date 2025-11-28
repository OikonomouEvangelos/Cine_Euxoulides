// src/frontend/src/components/MovieCategories.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './TrendingSection.css'; // Χρησιμοποιούμε το ίδιο στυλ

const MovieCategories = () => {
  const genres = [
    { id: 28, name: "Δράση" },
    { id: 35, name: "Κωμωδία" },
    { id: 27, name: "Τρόμου" },
    { id: 10749, name: "Ρομαντικές" },
    { id: 878, name: "Επιστ. Φαντασίας" },
    { id: 53, name: "Θρίλερ" },
    { id: 18, name: "Δράμα" },
    { id: 16, name: "Animation" }
  ];

  return (
    <div className="trending-section" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Επιλέξτε Κατηγορία</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {genres.map((genre) => (
          <Link to={`/movies/${genre.id}`} key={genre.id} style={{ textDecoration: 'none' }}>
            <div style={{
              width: '200px', height: '120px', backgroundColor: '#2c2c2c', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '15px', border: '1px solid #444', fontSize: '1.2rem', fontWeight: 'bold',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {genre.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieCategories;