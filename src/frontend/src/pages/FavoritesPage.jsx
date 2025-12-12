import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthHeaders, isAuthenticated } from '../services/auth';
import SearchBar from '../components/SearchBar'; // Import SearchBar to keep layout consistent
import './FavoritesPage.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                // 1. Get list of Favorite entries (contains movieId)
                const response = await fetch("http://localhost:8080/api/favorites/my?size=100", {
                    headers: getAuthHeaders()
                });

                if (!response.ok) throw new Error("Failed to load favorites");

                const data = await response.json();
                const favList = data.content || [];

                // 2. Fetch full Movie Details for each favorite
                const moviePromises = favList.map(fav =>
                    fetch(`/api/movie/${fav.movieId}`)
                        .then(res => {
                            if (res.ok) return res.json();
                            return null;
                        })
                        .catch(() => null)
                );

                const movies = await Promise.all(moviePromises);
                setFavorites(movies.filter(m => m !== null));

            } catch (err) {
                console.error(err);
                setError("Could not load favorites.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (!isAuthenticated()) {
        return (
            <div className="favorites-container empty-state">
                <h2>Access Denied</h2>
                <p>Please login to view your favorites.</p>
                <Link to="/" className="back-btn" style={{display:'inline-block', marginTop:'20px'}}>Go Home</Link>
            </div>
        );
    }

    if (loading) return <div className="favorites-container" style={{paddingTop: '100px', textAlign:'center', color:'white'}}><p>Loading favorites...</p></div>;

    return (
        <div className="favorites-page-wrapper">

            {/* --- TOP TOOLBAR (Exactly like MovieDetailPage) --- */}
            <div className="movie-top-toolbar" style={{position: 'relative', zIndex: 10, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Link to="/browse" className="back-btn" style={{textDecoration: 'none', color: 'white', fontWeight: 'bold', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '4px'}}>
                    &larr; Back to Browse
                </Link>
                {/* Optional: Add SearchBar here if you want it to look identical, or an empty div to push button left */}
                <div className="movie-page-search"><SearchBar /></div>
            </div>

            <div className="favorites-container">
                <h1 className="fav-title">My Favorites</h1>

                {favorites.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't added any movies to your favorites yet.</p>
                        <Link to="/browse" className="back-btn" style={{marginTop:'20px', display:'inline-block'}}>Browse Movies</Link>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map(movie => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="fav-card">
                                <img
                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/200x300'}
                                    alt={movie.title}
                                    className="fav-poster"
                                />
                                <div className="fav-overlay">
                                    <span className="fav-movie-title">{movie.title}</span>
                                    <span className="fav-year">{movie.release_date?.split('-')[0]}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;