import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuthHeaders, isAuthenticated } from '../services/auth';
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
                // 1. Ζητάμε τη λίστα με τα Favorites (IDs) από το Backend
                const response = await fetch("http://localhost:8080/api/favorites/my?size=100", {
                    headers: getAuthHeaders()
                });

                if (!response.ok) throw new Error("Failed to load favorites");

                const data = await response.json();
                const favList = data.content || [];

                // 2. Για κάθε Favorite ID, ζητάμε τα πλήρη στοιχεία της ταινίας
                // Χρησιμοποιούμε Promise.all για να τα φέρουμε παράλληλα
                const moviePromises = favList.map(fav =>
                    fetch(`/api/movie/${fav.movieId}`)
                        .then(res => {
                            if (res.ok) return res.json();
                            return null;
                        })
                        .catch(() => null)
                );

                const movies = await Promise.all(moviePromises);

                // Φιλτράρουμε τυχόν αποτυχημένες κλήσεις (null)
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
                <p>Παρακαλώ συνδεθείτε για να δείτε τα αγαπημένα σας.</p>
                <Link to="/browse" className="btn-home">Επιστροφή</Link>
            </div>
        );
    }

    if (loading) return <div className="favorites-container"><p>Φόρτωση αγαπημένων...</p></div>;

    return (
        <div className="favorites-container">
            <h1 className="fav-title">Τα Αγαπημένα μου</h1>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <p>Δεν έχετε προσθέσει ταινίες στα αγαπημένα ακόμα.</p>
                    <Link to="/browse" className="btn-home">Εξερευνήστε Ταινίες</Link>
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
    );
};

export default FavoritesPage;