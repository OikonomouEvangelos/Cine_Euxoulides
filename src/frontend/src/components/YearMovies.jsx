// src/frontend/src/components/YearMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../components/MovieCard.css";

const YearMovies = () => {
  const { year } = useParams(); // Παίρνουμε το έτος από το URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMoviesByYear = async () => {
      try {
        setLoading(true);

        // Ζητάμε ταινίες που κυκλοφόρησαν το συγκεκριμένο έτος
        // Ταξινομημένες κατά δημοτικότητα
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
    <div className="search-page" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none' }}>← Πίσω στην Αρχική</Link>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Ταινίες του <span style={{color: '#fbbf24'}}>{year}</span></h2>

      <div className="movies-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : 'https://via.placeholder.com/342x513'
                }
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

export default YearMovies;