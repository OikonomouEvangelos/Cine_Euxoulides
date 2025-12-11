// src/frontend/src/components/DirectorMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ΣΗΜΑΝΤΙΚΟ: Εισάγουμε το CSS για το overlay (όπως και στα άλλα αρχεία)
import './TrendingSection.css';

const DirectorMovies = () => {
  const { directorId } = useParams();
  const [movies, setMovies] = useState([]);
  const [directorName, setDirectorName] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchDirectorCredits = async () => {
      try {
        setLoading(true);

        // 1. Ζητάμε τα credits
        const creditsUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${API_KEY}&language=el-GR`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();

        // 2. Ζητάμε το όνομα
        const personUrl = `https://api.themoviedb.org/3/person/${directorId}?api_key=${API_KEY}&language=el-GR`;
        const personRes = await fetch(personUrl);
        const personData = await personRes.json();

        // 3. Φιλτράρουμε μόνο τις σκηνοθεσίες (Director)
        const directorWorks = creditsData.crew.filter(movie => movie.job === 'Director');

        // Ταξινόμηση και φιλτράρισμα εικόνας
        const sortedMovies = directorWorks
          .filter(movie => movie.poster_path)
          .sort((a, b) => b.popularity - a.popularity);

        setMovies(sortedMovies);
        setDirectorName(personData.name);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching director movies:", error);
        setLoading(false);
      }
    };

    fetchDirectorCredits();
  }, [directorId]);

  if (loading) return <div className="trending-section" style={{color:'white', padding:'20px'}}>Φόρτωση...</div>;

  return (
    <div className="trending-section" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none' }}>← Πίσω στην Αρχική</Link>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Σκηνοθεσία: <span style={{color: '#fbbf24'}}>{directorName}</span></h2>

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
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
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

                {/* Χρονολογία (Το 'movie.release_date' υπάρχει και εδώ) */}
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

export default DirectorMovies;