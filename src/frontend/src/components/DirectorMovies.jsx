// src/frontend/src/components/DirectorMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

        // 1. Ζητάμε τα credits (ταινίες) του προσώπου
        const creditsUrl = `https://api.themoviedb.org/3/person/${directorId}/movie_credits?api_key=${API_KEY}&language=el-GR`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();

        // 2. Ζητάμε το όνομα
        const personUrl = `https://api.themoviedb.org/3/person/${directorId}?api_key=${API_KEY}&language=el-GR`;
        const personRes = await fetch(personUrl);
        const personData = await personRes.json();

        // 3. ΤΟ ΣΗΜΑΝΤΙΚΟ: Ψάχνουμε στο CREW για job === 'Director'
        const directorWorks = creditsData.crew.filter(movie => movie.job === 'Director');

        // Ταξινόμηση και φιλτράρισμα (να έχουν εικόνα)
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

      <div className="movies-row" style={{ flexWrap: 'wrap', justifyContent: 'center', overflow: 'visible' }}>
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card-link">
            <div className="movie-card" style={{ marginBottom: '30px', margin: '15px' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>⭐️ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DirectorMovies;