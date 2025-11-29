// src/pages/SearchResultsPage.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

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

  // 1. Φέρνουμε τα genres (είδη) για να μεταφράζουμε genre_ids -> ονόματα
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

  // 2. Φέρνουμε τις ταινίες που ταιριάζουν στο searchTerm
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
      // Δεν ακουμπάμε το main error για τις ταινίες, γι' αυτό δεν κάνω setError εδώ
    }
  };

  fetchPersons();
}, [searchTerm]);

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
      // Δεν ακουμπάμε το main error για τις ταινίες, γι' αυτό δεν κάνω setError εδώ
    }
  };

  fetchPersons();
}, [searchTerm]);



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
      <h2>Αποτελέσματα για: "{searchTerm}"</h2>

      {isLoading && <p>Φόρτωση αποτελεσμάτων...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && movies.length === 0 && (
        <p>Δεν βρέθηκαν ταινίες για αυτή την αναζήτηση.</p>
      )}

      <div className="search-results-grid">
        {movies.map((movie) => {
          const {
            id,
            title,
            overview,
            poster_path,
            release_date,
            popularity,
            vote_average,
            genre_ids,
          } = movie;

          const genres =
            genre_ids && genre_ids.length > 0
              ? genre_ids
                  .map((gid) => genresMap[gid])
                  .filter(Boolean)
                  .join(', ')
              : 'Άγνωστο';

          return (
            <Link to={`/movie/${id}`} key={id} className="search-result-card">
              <div className="search-result-card-inner">
                <img
                  src={
                    poster_path
                      ? `https://image.tmdb.org/t/p/w342${poster_path}`
                      : 'https://via.placeholder.com/342x513'
                  }
                  alt={title}
                  className="search-result-poster"
                />
                <div className="search-result-info">
                  <h3>{title}</h3>

                  {release_date && (
                    <p>
                      <strong>Ημ. κυκλοφορίας:</strong> {release_date}
                    </p>
                  )}

                  <p>
                    <strong>Δημοτικότητα:</strong> {Math.round(popularity)}</p>
                  <p>
                    <strong>Βαθμολογία:</strong> {vote_average ?? 'N/A'}
                  </p>

                  <p>
                    <strong>Είδη:</strong> {genres}
                  </p>

                  {overview && (
                    <p className="search-result-overview">
                      {overview}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
            {/* Μπλοκ για ηθοποιούς / σκηνοθέτες */}
            {persons.length > 0 && (
              <section className="search-persons-section">
                <h3>Άτομα που ταιριάζουν με την αναζήτηση</h3>
                <ul className="search-persons-list">
                  {persons.map((person) => {
                    const isActor = person.known_for_department === 'Acting';
                    const isDirector = person.known_for_department === 'Directing';

                    // Επιλέγουμε σε ποια σελίδα θα τον στείλουμε
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
    </main>
  );
};

export default SearchResultsPage;
