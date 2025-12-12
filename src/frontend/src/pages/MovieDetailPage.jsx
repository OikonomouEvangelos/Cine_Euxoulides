import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// UI Components
import DetailTabs from '../components/ui/DetailTabs';
import SearchBar from '../components/SearchBar';
import ReviewsList from '../components/ReviewsList';
import StarRating from '../components/StarRating';

// CSS
import './MovieDetailPage.css';

// Auth Helpers
import { getAuthHeaders, getCurrentUserId, isAuthenticated } from '../services/auth';

const MovieDetailPage = () => {
    const { id } = useParams();
    const currentMovieId = id;
    const currentUserId = getCurrentUserId();

    // --- MOVIE DATA STATE ---
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0, totalComments: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('cast');

    // --- INTERACTIVE STATE ---
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState("");
    const [existingReviewId, setExistingReviewId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Triggers list refresh

    const [isFavorite, setIsFavorite] = useState(false);

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Movie Details
                const movieRes = await fetch(`/api/movie/${id}`);
                if (!movieRes.ok) throw new Error("Could not fetch movie.");
                const movieData = await movieRes.json();
                setMovie(movieData);

                // Credits
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

    // --- 2. FETCH DYNAMIC DATA (Stats, Reviews, Favorite) ---
    useEffect(() => {
        const fetchUserData = async () => {
            // A. Fetch Community Stats
            try {
                const statsRes = await fetch(`http://localhost:8080/api/reviews/movie/${currentMovieId}/stats`);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }
            } catch (e) { console.error("Stats fetch failed", e); }

            if (currentUserId) {
                const headers = getAuthHeaders();

                // B. Check if I already reviewed
                try {
                    const reviewsRes = await fetch(`http://localhost:8080/api/reviews/movie/${currentMovieId}`, { headers });
                    const reviewsData = await reviewsRes.json();
                    const myReview = reviewsData.content.find(r => r.userId === String(currentUserId));
                    if (myReview) {
                        setMyRating(myReview.rating || 0);
                        // CHANGED: We do NOT fill the comment box anymore.
                        // The user sees their review in the list below.
                        setExistingReviewId(myReview.id);
                    }
                } catch (e) { console.error(e); }

                // C. Check Favorite
                try {
                    const favRes = await fetch(`http://localhost:8080/api/favorites/check?movieId=${currentMovieId}`, { headers });
                    const isFav = await favRes.json();
                    setIsFavorite(isFav);
                } catch (e) { console.error(e); }
            }
        };

        fetchUserData();
    }, [currentMovieId, currentUserId, refreshKey]); // Re-run when refreshKey changes

    // --- HANDLERS ---

    const handleToggleFavorite = async () => {
        if (!isAuthenticated()) { alert("Please login first!"); return; }
        const prev = isFavorite;
        setIsFavorite(!prev); // Optimistic

        try {
            await fetch("http://localhost:8080/api/favorites/toggle", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ movieId: currentMovieId })
            });
        } catch (error) {
            setIsFavorite(prev); // Revert
            console.error(error);
        }
    };

    // SUBMIT RATING ONLY (Left Box)
    const handleSubmitRating = async () => {
        if (!isAuthenticated()) { alert("Please login first!"); return; }
        if (myRating === 0) { alert("Please select a star rating!"); return; }

        try {
            const response = await fetch("http://localhost:8080/api/reviews/add", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    movieId: currentMovieId,
                    rating: myRating,
                    comment: existingReviewId ? null : "" // Don't overwrite comment if just rating
                })
            });

            if (response.ok) {
                alert("Rating submitted!");
                setRefreshKey(old => old + 1); // Refresh stats
            }
        } catch (error) {
            console.error("Rating error:", error);
        }
    };

    // SUBMIT COMMENT (Right Tab)
    const handleSubmitComment = async () => {
        if (!isAuthenticated()) { alert("Please login first!"); return; }
        if (!myComment.trim()) { alert("Write a comment first!"); return; }

        try {
            const response = await fetch("http://localhost:8080/api/reviews/add", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    movieId: currentMovieId,
                    rating: myRating > 0 ? myRating : null, // Send rating if it exists
                    comment: myComment
                })
            });

            if (response.ok) {
                setMyComment(""); // CLEAR INPUT
                setRefreshKey(old => old + 1); // UPDATE LIST & STATS
            } else {
                alert("Failed to save comment.");
            }
        } catch (error) {
            console.error("Comment error:", error);
        }
    };

    if (loading) return <div className="movie-detail-container" style={{padding:'100px', textAlign:'center'}}>Loading...</div>;
    if (error || !movie) return <div className="movie-detail-container">Error: {error}</div>;

    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : '';
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/230x345';
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';

    return (
        <div className="movie-detail-container">
            <div className="movie-top-toolbar">
                <Link to="/browse" className="back-btn">&larr; Back to Browse</Link>
                <div className="movie-page-search"><SearchBar /></div>
            </div>

            <div className="backdrop-layer" style={{ backgroundImage: `url(${backdropUrl})` }} />

            <div className="content-wrapper">

                {/* --- LEFT COLUMN: POSTER & RATING --- */}
                <div className="poster-column">
                    <img src={posterUrl} alt={movie.title} className="poster-img" />

                    <div className="interaction-panel">

                        {/* 1. Community Rating */}
                        <div className="community-rating-box">
                            <span className="cr-label">Community Rating</span>
                            <div className="cr-score">
                                <span style={{color: '#ffc107', fontSize:'1.5rem'}}>★</span>
                                <span className="cr-value">{stats.averageRating.toFixed(1)}</span>
                                <span className="cr-count">({stats.totalRatings})</span>
                            </div>
                        </div>

                        <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin:'15px 0'}} />

                        {/* 2. User Rating */}
                        <div style={{marginBottom: '10px'}}>
                            <small style={{color:'#00e054', fontWeight:'bold'}}>YOUR RATING</small>
                            <div style={{ margin: '5px 0' }}>
                                <StarRating
                                    rating={myRating}
                                    onRatingChange={(newRating) => setMyRating(newRating)}
                                    editable={true}
                                />
                            </div>
                            <div style={{fontSize:'0.9rem', color:'#ccc'}}>
                                {myRating > 0 ? `You rated: ${myRating}` : "Tap stars to rate"}
                            </div>
                        </div>

                        {/* 3. Submit Rating Button */}
                        <button
                            className="btn-submit-rating"
                            onClick={handleSubmitRating}
                            style={{marginBottom: '20px', width: '100%'}}
                        >
                            Submit Rating
                        </button>

                        <button className="btn-trailer" onClick={() => alert("Trailer coming soon")}>
                            ▶ Trailer
                        </button>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: INFO & COMMENTS --- */}
                <div className="info-column">

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1 className="movie-title" style={{ margin: 0 }}>
                            {movie.title} <span className="year">{year}</span>
                        </h1>
                    </div>

                    <div className="director-line"><span>Directed by</span> Unknown</div>
                    {movie.tagline && <div className="tagline">{movie.tagline}</div>}

                    <div className="synopsis">{movie.overview}</div>

                    {/* --- TABS --- */}
                    <div style={{marginTop: '40px'}}>
                        <DetailTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                        />

                        <div className="tab-content-area" style={{marginTop:'15px'}}>
                            {activeTab === 'cast' && (
                                <div className="cast-scroller">
                                    {credits?.cast?.slice(0, 15).map(actor => (
                                        <div key={actor.id} className="actor-card">
                                            <img src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/90x135'} alt={actor.name} />
                                            <p className="actor-name">{actor.name}</p>
                                            <p className="actor-char">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="tech-details-grid">
                                    <div className="tech-text">
                                        <p><strong>Original Title:</strong> {movie.original_title}</p>
                                        <p><strong>Status:</strong> {movie.status}</p>
                                        <p><strong>Release Date:</strong> {movie.release_date}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="reviews-tab-container" style={{ animation: 'fadeIn 0.5s' }}>
                                    <h3 style={{marginBottom:'20px'}}>
                                        Community Reviews ({stats.totalComments})
                                    </h3>

                                    {/* INPUT */}
                                    <div className="comment-input-area" style={{ marginBottom: '30px' }}>
                                        <textarea
                                            value={myComment}
                                            onChange={(e) => setMyComment(e.target.value)}
                                            placeholder="Write your review here..."
                                            rows="3"
                                            className="comment-input"
                                        ></textarea>

                                        <button className="btn-trailer" onClick={handleSubmitComment} style={{marginTop:'10px', width: 'auto'}}>
                                            Post Comment
                                        </button>
                                    </div>

                                    {/* LIST */}
                                    <ReviewsList movieId={currentMovieId} refreshTrigger={refreshKey} />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;