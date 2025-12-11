// src/frontend/src/components/YearMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ΣΗΜΑΝΤΙΚΟ: Εισάγουμε το CSS για το overlay
import './TrendingSection.css';

const YearMovies = () => {
  const { year } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMoviesByYear = async () => {
      try {
        setLoading(true);

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=el-GR&sort_by=popularity.desc&primary_release_year=${year}`;

        const res = await fetch(url);
        const data = await res.json();

        setMovies(data.results || []);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching movies by year:", error);
        setLoading(false);
      }
    };

    fetchMoviesByYear();
  }, [year]);

  if (loading) return <div className="trending-section" style={{color:'white', padding:'20px'}}>Φόρτωση...</div>;

  return (
    <div className="trending-section" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none' }}>← Πίσω στην Αρχική</Link>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Ταινίες του <span style={{color: '#fbbf24'}}>{year}</span></h2>

      <div
        className="movies-row"
        style={{ flexWrap: 'wrap', justifyContent: 'center', display: 'flex' }}
      >
        {movies.map((movie) => (

          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="movie-card-link"
            style={{ margin: '10px' }}
          >
            <div className="movie-card">

              {/* Εικόνα */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750'
                }
                alt={movie.title}
                className="movie-poster"
              />

              {/* ΤΟ OVERLAY (Εδώ μπαίνουν οι πληροφορίες για το Hover) */}
              <div className="movie-overlay">

                {/* Βαθμολογία */}
                <div className="overlay-stars">
                   ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                   <span className="vote-count"> ({movie.vote_count})</span>
                </div>

                {/* Χρονολογία */}
                <div className="overlay-meta" style={{ color: '#ccc', fontSize: '0.9rem', margin: '5px 0' }}>
                   {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                </div>

                {/* Τίτλος */}
                <div className="overlay-title">{movie.title}</div>

              </div>

            </div>
          </Link>

        ))}
      </div>
    </div>
  );
};

export default YearMovies;