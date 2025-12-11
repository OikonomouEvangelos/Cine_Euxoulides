// src/frontend/src/components/ActorMovies.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// ΣΗΜΑΝΤΙΚΟ: Εισάγουμε το CSS που έχει το στυλ για το overlay (όπως στο MovieRow)
import './TrendingSection.css';

const ActorMovies = () => {
  const { actorId } = useParams();
  const [movies, setMovies] = useState([]);
  const [actorName, setActorName] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchActorCredits = async () => {
      try {
        setLoading(true);

        const creditsUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}&language=el-GR`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();

        const personUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=el-GR`;
        const personRes = await fetch(personUrl);
        const personData = await personRes.json();

        const sortedMovies = creditsData.cast
          .filter(movie => movie.poster_path)
          .sort((a, b) => b.popularity - a.popularity);

        setMovies(sortedMovies);
        setActorName(personData.name);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching actor movies:", error);
        setLoading(false);
      }
    };

    fetchActorCredits();
  }, [actorId]);

  if (loading) return <div className="trending-section" style={{color:'white', padding:'20px'}}>Φόρτωση...</div>;

  return (
    <div className="trending-section" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '20px' }}>
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none' }}>← Πίσω στην Αρχική</Link>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Ταινίες με: <span style={{color: '#fbbf24'}}>{actorName}</span></h2>

      <div
        className="movies-row"
        style={{ flexWrap: 'wrap', justifyContent: 'center', display: 'flex' }}
      >
        {movies.map((movie) => (

          // ΑΛΛΑΓΗ: Αντί για <MovieCard>, βάζουμε τη δομή με το Overlay
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="movie-card-link"
            style={{ margin: '10px' }} // Λίγο κενό γύρω από κάθε κάρτα
          >
            <div className="movie-card">

              {/* Εικόνα */}
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
                alt={movie.title}
                className="movie-poster"
              />

              {/* ΤΟ OVERLAY (Εδώ είναι η μαγεία για να φαίνεται όπως θες) */}
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

export default ActorMovies;