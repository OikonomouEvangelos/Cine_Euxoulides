// src/pages/SearchResultsPage.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard'; // (ακόμα κι αν δεν το χρησιμοποιούμε εδώ)
import "../components/MovieCard.css"; // για να φορτώνει τα styles των καρτών

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const SearchResultsPage = () => {
  const queryParams = useQuery();
  const searchTerm = queryParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [persons, setPersons] = useState([]);

  // 1. Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      const trimmed = searchTerm.trim();
      if (!trimmed || !API_KEY) return;

      setIsLoading(true);
      setError(null);

      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=el-GR&query=${encodeURIComponent(
          trimmed
        )}&page=1&include_adult=false`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Αποτυχία αιτήματος');
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Κάτι πήγε στραβά.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm]);

  // 2. Fetch Persons
  useEffect(() => {
    const fetchPersons = async () => {
      const trimmed = searchTerm.trim();
      if (!trimmed || !API_KEY) return;
      try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=el-GR&query=${encodeURIComponent(
          trimmed
        )}&page=1&include_adult=false`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPersons(data.results || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPersons();
  }, [searchTerm]);

  if (!searchTerm) {
    return (
      <main>
        <div className="search-page">
          <h2 style={{ color: 'white', textAlign: 'center' }}>Αναζήτηση ταινιών</h2>
          <p style={{ color: '#ccc', textAlign: 'center' }}>
            Πληκτρολογήστε κάτι στην μπάρα αναζήτησης.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="search-page">
        <h2 className="search-title">Αποτελέσματα για: "{searchTerm}"</h2>

        {isLoading && <p style={{ color: 'white' }}>Φόρτωση...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading && !error && movies.length === 0 && persons.length === 0 && (
          <p style={{ color: 'white' }}>Δεν βρέθηκαν αποτελέσματα.</p>
        )}

        {/* Ταινίες */}
        <div className="movies-grid">
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card-link"
            >
              <div className="movie-card">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                      : 'https://via.placeholder.com/342x513'
                  }
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 title={movie.title}>{movie.title}</h3>
                  <p className="movie-rating">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Πρόσωπα */}
        {persons.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h3
              className="search-title"
              style={{ borderLeft: '5px solid #00e054' }}
            >
              Πρόσωπα
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {persons.map((p) => (
                <li
                  key={p.id}
                  style={{ marginBottom: '10px', color: 'white' }}
                >
                  <strong>{p.name}</strong> ({p.known_for_department})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;
