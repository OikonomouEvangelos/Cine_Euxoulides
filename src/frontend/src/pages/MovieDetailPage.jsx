import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import DetailTabs from '../components/ui/DetailTabs';
import RatingSection from '../components/ui/RatingSection';
import './MovieDetailPage.css';

const MovieDetailPage = () => {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('cast');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const movieRes = await axios.get(`http://localhost:8080/api/movie/${id}`);
                let movieData = movieRes.data;
                if (typeof movieData === 'string') movieData = JSON.parse(movieData);
                setMovie(movieData);

                const credsRes = await axios.get(`http://localhost:8080/api/movie/${id}/credits`);
                setCredits(credsRes.data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Could not load movie data.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="movie-detail-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}><h2>Loading...</h2></div>;
    if (error || !movie) return <div className="movie-detail-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}><h2>Error: {error}</h2></div>;

    const director = credits?.crew?.find(member => member.job === 'Director');
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/230x345?text=No+Poster';
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';
    const hasFinancials = movie.budget > 0 && movie.revenue > 0;
    const roi = hasFinancials ? (movie.revenue / movie.budget) : 0;
    const isProfitable = (movie.revenue - movie.budget) > 0;
    const profitColor = isProfitable ? '#00e054' : '#ff4040';

    const renderTabContent = () => {
        switch (activeTab) {
            case 'cast':
                return (
                    <div className="cast-scroller">
                        {credits?.cast?.slice(0, 12).map(actor => (
                            <div key={actor.id} className="actor-card">
                                <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/138x175?text=No+Img'} alt={actor.name} />
                                <div className="actor-info">
                                    <p className="actor-name">{actor.name}</p>
                                    <p className="actor-char">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'details':
                return (
                    <div className="tech-details-grid">
                        <div className="tech-text">
                            <p><strong>Original Title:</strong> <span style={{color:'white'}}>{movie.original_title}</span></p>
                            <p><strong>Status:</strong> <span style={{color:'white'}}>{movie.status}</span></p>
                            <p><strong>Language:</strong> <span style={{color:'white'}}>{movie.original_language?.toUpperCase()}</span></p>
                            <p><strong>Budget:</strong> <span style={{color:'white'}}>{movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : '-'}</span></p>
                            <p><strong>Revenue:</strong> <span style={{color:'white'}}>{movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : '-'}</span></p>
                        </div>
                        <div className="rating-chart-container" style={{flex: 1}}>
                            <h4 style={{marginTop:0, marginBottom:'15px', color:'#99aabb', textTransform:'uppercase', fontSize:'0.85rem'}}>Performance Stats</h4>
                            <div className="chart-row">
                                <div className="chart-label"><span>TMDB Score</span><span>{movie.vote_average?.toFixed(1)} / 10</span></div>
                                <div className="chart-track"><div className="chart-fill score-fill" style={{ width: `${(movie.vote_average || 0) * 10}%`, backgroundColor: '#00e054' }}></div></div>
                            </div>
                            <div className="chart-row" style={{marginTop:'15px'}}>
                                <div className="chart-label"><span>Viewer Reach</span><span>{(movie.vote_count / 1000).toFixed(1)}k Ratings</span></div>
                                <div className="chart-track"><div className="chart-fill" style={{ width: `${Math.min((movie.vote_count / 20000) * 100, 100)}%`, backgroundColor: '#40bcf4' }}></div></div>
                                <small style={{color:'#667', fontSize:'0.7rem'}}>Total user engagement</small>
                            </div>
                            {hasFinancials && (
                                <div className="chart-row" style={{marginTop:'15px'}}>
                                    <div className="chart-label"><span>Box Office Return</span><span style={{color: profitColor}}>{(roi * 100).toFixed(0)}%</span></div>
                                    <div className="chart-track"><div className="chart-fill" style={{ width: `${Math.min(roi * 33, 100)}%`, backgroundColor: profitColor }}></div></div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="movie-detail-container">
            <div className="backdrop-layer" style={{ backgroundImage: `url(${backdropUrl})` }} />
            <div className="movie-detail-overlay">
                <div className="content-wrapper">

                    {/* --- LEFT COLUMN --- */}
                    <div className="poster-column">

                        {/* ✅ MOVED TO TOP: Back Arrow */}
                        <Link to="/browse" className="back-link">
                            &larr; Back to Browse
                        </Link>

                        <img src={posterUrl} alt={movie.title} className="poster-img" />

                        <div className="interaction-panel">
                            <small style={{display:'block', marginBottom:'8px', color:'#00e054', fontWeight:'bold', letterSpacing:'1px', fontSize:'0.7rem'}}>RATE FILM</small>
                            <RatingSection movieId={movie.id} initialRating={movie.vote_average} />
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="info-column">
                        <h1 className="movie-title">{movie.title} <span className="year">{year}</span></h1>
                        <div className="director-line">Directed by <span>{director ? director.name : 'Unknown'}</span></div>
                        {movie.tagline && <div className="tagline">“{movie.tagline}”</div>}
                        <div className="movie-meta-row">
                             <span className="runtime">{movie.runtime} mins</span>
                             <div className="genres-list">
                                {movie.genres?.map(g => (<span key={g.id} className="genre-tag">{g.name}</span>))}
                            </div>
                        </div>
                        <div className="synopsis">{movie.overview || "No synopsis available."}</div>
                        <div style={{marginTop: '40px'}}>
                            <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
                            <div className="tab-content-area" style={{marginTop:'20px'}}>{renderTabContent()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;