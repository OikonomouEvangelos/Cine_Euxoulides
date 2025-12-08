import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import DetailTabs from '../components/ui/DetailTabs';
import RatingSection from '../components/ui/RatingSection';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // CHANGE: Default tab is now 'cast' since Overview is static
    const [activeTab, setActiveTab] = useState('cast');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieRes = await fetch(`/api/movie/${id}`);
                if (!movieRes.ok) throw new Error("Could not fetch movie.");
                const movieData = await movieRes.json();
                setMovie(movieData);

                const credsRes = await fetch(`/api/movie/${id}/credits`);
                if (credsRes.ok) setCredits(await credsRes.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="movie-detail-container" style={{padding:'100px', textAlign:'center'}}>Loading...</div>;
    if (error || !movie) return <div className="movie-detail-container">Error: {error}</div>;

    // Helpers
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : '';
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/230x345';
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';

    // Tab Content Logic
    const renderTabContent = () => {
        switch (activeTab) {
            case 'cast':
                return (
                    <div className="cast-scroller">
                        {credits?.cast?.slice(0, 15).map(actor => (
                            <div key={actor.id} className="actor-card">
                                <img
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/90x135'}
                                    alt={actor.name}
                                />
                                <p className="actor-name">{actor.name}</p>
                                <p className="actor-char">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'details':
                            return (
                                <div className="tech-details-grid">

                                    {/* Left Side: Text Info */}
                                    <div className="tech-text">
                                        <p><strong>Original Title:</strong> {movie.original_title}</p>
                                        <p><strong>Status:</strong> {movie.status}</p>
                                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                                        <p><strong>Original Language:</strong> {movie.original_language?.toUpperCase()}</p>
                                    </div>

                                    {/* Right Side: The Rating Chart */}
                                    <div className="rating-chart-container">
                                        <h4 style={{marginTop:0, marginBottom:'15px', color:'white'}}>Rating Analysis</h4>

                                        {/* Bar 1: User Score */}
                                        <div className="chart-row">
                                            <div className="chart-label">
                                                <span>User Score</span>
                                                <span>{movie.vote_average.toFixed(1)} / 10</span>
                                            </div>
                                            <div className="chart-track">
                                                <div
                                                    className="chart-fill score-fill"
                                                    style={{ width: `${movie.vote_average * 10}%` }}
                                                ></div>
                                            </div>
                                            <small style={{color:'#667', fontSize:'0.7rem'}}>{movie.vote_count.toLocaleString()} votes</small>
                                        </div>

                                        {/* Bar 2: Popularity (Normalized) */}
                                        {/* We cap popularity visual at 100 for the bar, though it can go higher */}
                                        <div className="chart-row" style={{marginTop:'15px'}}>
                                            <div className="chart-label">
                                                <span>Trend / Popularity</span>
                                                <span>{Math.round(movie.popularity)}</span>
                                            </div>
                                            <div className="chart-track">
                                                <div
                                                    className="chart-fill pop-fill"
                                                    style={{ width: `${Math.min(movie.popularity, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
        }
    };

    return (
        <div className="movie-detail-container">
            <Link to="/browse" className="back-btn">&larr; Back to Browse</Link>

            <div className="backdrop-layer" style={{ backgroundImage: `url(${backdropUrl})` }} />

            <div className="content-wrapper">

                {/* --- LEFT COLUMN: POSTER --- */}
                <div className="poster-column">
                    <img src={posterUrl} alt={movie.title} className="poster-img" />

                    <div className="interaction-panel" style={{textAlign:'center'}}>
                        <small style={{display:'block', marginBottom:'5px', color:'#00e054'}}>RATE THIS FILM</small>
                        <RatingSection movieId={movie.id} initialRating={movie.vote_average} />
                    </div>

                    <button className="btn-trailer" onClick={() => alert("Trailer coming soon")}>
                        ▶ Trailer
                    </button>
                </div>

                {/* --- RIGHT COLUMN: INFO & TABS --- */}
                <div className="info-column">

                    <h1 className="movie-title">
                        {movie.title} <span className="year">{year}</span>
                    </h1>

                    <div className="director-line">
                        <span>Directed by</span> Unknown
                    </div>

                    {movie.tagline && <div className="tagline">{movie.tagline}</div>}

                    {/* 1. STATIC SYNOPSIS (Always visible now) */}
                    <div className="synopsis">
                        {movie.overview}
                    </div>

                    {/* 2. TABS BELOW SYNOPSIS */}
                    <div style={{marginTop: '40px'}}>
                        <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

                        <div className="tab-content-area" style={{marginTop:'15px'}}>
                            {renderTabContent()}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;