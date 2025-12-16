import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';

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

      {/* --- ΚΟΥΤΙ ΠΛΟΗΓΗΣΗΣ ΚΑΙ ΑΝΑΖΗΤΗΣΗΣ --- */}
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between', // Αριστερά το Πίσω, Δεξιά το Search
        alignItems: 'center'
      }}>
        {/* Αριστερά: Κουμπί επιστροφής */}
        <Link to="/" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '1.1rem' }}>
          ← Πίσω στην Αρχική
        </Link>

        {/* Δεξιά: Search Bar */}
        <div style={{ width: '300px' }}> {/* Ορίζουμε πλάτος για να μην είναι τεράστιο */}
            <SearchBar />
        </div>
      </div>

      <h2 style={{ paddingLeft: '20px' }}>Ταινίες με: <span style={{color: '#fbbf24'}}>{actorName}</span></h2>

      <div
        className="movies-row"
        style={{ flexWrap: 'wrap', justifyContent: 'center', overflow: 'visible' }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

    </div>
  );
};

export default ActorMovies;