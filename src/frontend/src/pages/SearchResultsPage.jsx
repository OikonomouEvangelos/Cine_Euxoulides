// src/pages/SearchResultsPage.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SearchResultsPage.css';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// helper για να διαβάσουμε το ?q= από το URL
function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const SearchResultsPage = () => {
  const queryParams = useQuery();
  const searchTerm = queryParams.get('q') || '';

  const [movies, setMovies] = useState([]);
  const [genresMap, setGenresMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [persons, setPersons] = useState([]);

  // 1. Φέρνουμε genres
  useEffect(() => {
    const fetchGenres = async () => {
      if (!API_KEY) return;

      try {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=el-GR`;
        const response = await fetch(url);
        const data = await response.json();

        const map = {};
        (data.genres || []).forEach((g) => {
          map[g.id] = g.name;
        });
        setGenresMap(map);
      } catch (err) {
        console.error('Σφάλμα στη λήψη genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // 2. Φέρνουμε ταινίες
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
        if (!response.ok) {
          throw new Error('Αποτυχία αιτήματος αναζήτησης');
        }

        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Κάτι πήγε στραβά κατά την αναζήτηση.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  // 3. Φέρνουμε άτομα (ηθοποιούς / σκηνοθέτες)
  useEffect(() => {
    const fetchPersons = async () => {
      const trimmed = searchTerm.trim();
      if (!trimmed || !API_KEY) return;

      try {
        const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=el-GR&query=${encodeURIComponent(
          trimmed
        )}&page=1&include_adult=false`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Αποτυχία αιτήματος αναζήτησης ατόμων');
        }

        const data = await response.json();
        setPersons(data.results || []);
      } catch (err) {
        console.error('Σφάλμα στην αναζήτηση ατόμων:', err);
      }
    };

    fetchPersons();
  }, [searchTerm]);

  // Αν δεν υπάρχει αναζήτηση
  if (!searchTerm) {
    return (
      <main>
        <h2>Αναζήτηση ταινιών</h2>
        <p>Δεν δόθηκε όρος αναζήτησης.</p>
      </main>
    );
  }

  return (
    <main>
      <div className="search-page">
        <h2 className="search-title">
          Αποτελέσματα για: "{searchTerm}"
        </h2>

        {isLoading && <p>Φόρτωση αποτελεσμάτων...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && movies.length === 0 && (
          <p>Δεν βρέθηκαν ταινίες για αυτή την αναζήτηση.</p>
        )}

        {/* GRID ΤΑΙΝΙΩΝ */}
        <div className="search-grid">
          {movies.map((movie) => {
            const { id, title, poster_path, vote_average } = movie;

            return (
              <Link to={`/movie/${id}`} key={id}>
                <div className="search-card">
                  <img
                    src={
                      poster_path
                        ? `https://image.tmdb.org/t/p/w342${poster_path}`
                        : 'https://via.placeholder.com/342x513'
                    }
                    alt={title}
                    className="search-poster"
                  />

                  <div className="search-info">
                    <h3 title={title}>{title}</h3>
                    <p className="search-rating">
                      ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ΜΠΛΟΚ ΓΙΑ ΗΘΟΠΟΙΟΥΣ / ΣΚΗΝΟΘΕΤΕΣ */}
        {persons.length > 0 && (
          <section className="search-persons-section">
            <h3>Άτομα που ταιριάζουν με την αναζήτηση</h3>
            <ul className="search-persons-list">
              {persons.map((person) => {
                const isActor = person.known_for_department === 'Acting';
                const isDirector = person.known_for_department === 'Directing';

                let targetPath = null;
                if (isActor) {
                  targetPath = `/actors/${person.id}`;
                } else if (isDirector) {
                  targetPath = `/directors/${person.id}`;
                }

                return (
                  <li key={person.id} className="search-person-item">
                    {targetPath ? (
                      <Link to={targetPath}>
                        <strong>{person.name}</strong>{' '}
                        {isActor && <span>(Ηθοποιός)</span>}
                        {isDirector && <span>(Σκηνοθέτης)</span>}
                      </Link>
                    ) : (
                      <span>
                        <strong>{person.name}</strong>{' '}
                        {person.known_for_department && (
                          <span>({person.known_for_department})</span>
                        )}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;