import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieDetailPage.css'; // Reuse the Blue Theme

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = "user123";

    useEffect(() => {
        fetch(`http://localhost:8080/api/favorites/user/${currentUserId}`)
            .then(response => response.json())
            .then(data => {
                setFavorites(data.content || []);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching favorites:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="movie-detail-container" style={{ padding: '40px' }}>
            <h1 style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px' }}>
                My Favorites
            </h1>

            {loading ? (
                <p>Loading favorites...</p>
            ) : favorites.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#ccc' }}>
                    <h3>You haven't added any favorites yet.</h3>
                    <p>Go browse movies and click the Heart button!</p>
                    <Link to="/browse">
                        <button className="btn-secondary" style={{ marginTop: '20px' }}>Browse Movies</button>
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {favorites.map((fav) => (
                        <div key={fav.id} style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '250px',
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#aaa'
                            }}>
                                Poster Placeholder
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Movie #{fav.movieId}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '15px' }}>
                                Added: {new Date(fav.addedAt).toLocaleDateString()}
                            </p>

                            <Link to={`/movie/${fav.movieId}`}>
                                <button className="btn-secondary" style={{ width: '100%' }}>View</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;