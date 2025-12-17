import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// --- ΔΙΟΡΘΩΣΗ IMPORTS ---
// Επειδή είμαστε ήδη μέσα στον φάκελο components, καλούμε τα αρχεία απευθείας:
import './MovieCard.css';      // <--- ΔΙΟΡΘΩΘΗΚΕ (Ήταν ../components/...)
import SearchBar from './SearchBar';
import './TrendingSection.css';

const DirectorMovies = () => {
  // Παίρνουμε το ID από το URL (π.χ. "525")
  const { directorId } = useParams();

  const [movies, setMovies] = useState([]);
  const [directorName, setDirectorName] = useState('');
  const [loading, setLoading] = useState(true);

  // Βεβαιώσου ότι το API KEY υπάρχει στο .env αρχείο
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchDirectorData = async () => {
      // --- DEBUGGING: ΕΛΕΓΧΟΣ ΣΤΗΝ ΚΟΝΣΟΛΑ ---
      console.log("--> Director Page Loaded");
      console.log("--> ID from URL:", directorId);

      if (!directorId) return;

      try {
        setLoading(true);

        // 1. Ζητάμε το ΟΝΟΜΑ του σκηνοθέτη
        const personUrl = `https://api.themoviedb.org/3/person/${directorId}?api_key=${API_KEY}&language=el-GR`;
        const personRes = await fetch(personUrl);

        if (!personRes.ok) throw new Error("Director info fetch failed");

        const personData = await personRes.json();
        setDirectorName(personData.name);
        console.log("--> Director Name Found:", personData.name);

        // 2. Ζητάμε τις ΤΑΙΝΙΕΣ (Credits)
        const creditsUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${API_KEY}&language=el-GR`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();

        // 3. Φιλτράρουμε μόνο όπου ήταν Σκηνοθέτης (Director)
        const crew = creditsData.crew || [];
        const directorWorks = crew.filter(movie => movie.job === 'Director');

        console.log("--> Movies found (before sort):", directorWorks.length);

        // 4. Ταξινόμηση κατά δημοτικότητα και φιλτράρισμα εικόνας
        const sortedMovies = directorWorks
          .filter(movie => movie.poster_path)
          .sort((a, b) => b.popularity - a.popularity);

        setMovies(sortedMovies);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching director movies:", error);
        setLoading(false);
      }
    };

    fetchDirectorData();
  }, [directorId, API_KEY]);

  if (loading) return <div className="trending-section" style={{color:'white', padding:'20px'}}>Φόρτωση ταινιών σκηνοθέτη...</div>;

  return (
    <div className="trending-section" style={{ minHeight: '100vh' }}>

      {/* --- MENU & SEARCH --- */}
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.1rem' }}>
          ← Πίσω στην Αρχική
        </Link>
        <div style={{ width: '300px' }}>
            <SearchBar />
        </div>
      </div>

      {/* Τίτλος */}
      <h2 style={{ paddingLeft: '20px' }}>
          Ταινίες από: <span style={{color: '#fbbf24'}}>{directorName}</span>
      </h2>

      {/* Λίστα Ταινιών */}
      {movies.length === 0 ? (
        <div style={{color:'white', padding:'20px'}}>Δεν βρέθηκαν ταινίες για αυτόν τον σκηνοθέτη.</div>
      ) : (
        <div className="movies-row" style={{ flexWrap: 'wrap', justifyContent: 'center', display: 'flex' }}>
          {movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="movie-card-link"
              style={{ margin: '10px' }}
            >
              <div className="movie-card">
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                  alt={movie.title}
                  className="movie-poster"
                />
                {/* Overlay Εφέ */}
                <div className="movie-overlay">
                  <div className="overlay-stars">
                     ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
                     <span className="vote-count"> ({movie.vote_count})</span>
                  </div>
                  <div className="overlay-meta" style={{ color: '#ccc', fontSize: '0.9rem', margin: '5px 0' }}>
                     {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                  </div>
                  <div className="overlay-title">{movie.title}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorMovies;