import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetailPage.css';
import ReviewsList from '../components/ReviewsList';
import StarRating from '../components/StarRating';

const MovieDetailPage = () => {
    const { id } = useParams();
    const currentMovieId = id || 550;
    const currentUserId = "user123";

    // --- STATE ---
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState("");
    const [existingReviewId, setExistingReviewId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // --- FAVORITE STATE ---
    const [isFavorite, setIsFavorite] = useState(false);

    // Static Movie Data
    const movie = {
        title: "Movie Title",
        imageUrl: "https://via.placeholder.com/1200x500?text=Movie+Poster+Background",
        description: "This is a short description of the movie, featuring key plot points and reviews. Duration, year, and genre can be displayed here.",
        tagline: "A story that will captivate you."
    };

    // --- LOAD DATA ---
    useEffect(() => {
        // 1. Load Review
        fetch(`http://localhost:8080/api/reviews/movie/${currentMovieId}`)
            .then(res => res.json())
            .then(data => {
                const reviews = data.content || [];
                const myReview = reviews.find(r => r.userId === currentUserId);
                if (myReview) {
                    setMyRating(myReview.rating || 0);
                    setMyComment(myReview.comment || "");
                    setExistingReviewId(myReview.id);
                }
            })
            .catch(err => console.error(err));

        // 2. Load Favorite Status
        fetch(`http://localhost:8080/api/favorites/check?userId=${currentUserId}&movieId=${currentMovieId}`)
            .then(res => res.json())
            .then(isFav => setIsFavorite(isFav))
            .catch(err => console.error("Fav check failed:", err));

    }, [currentMovieId, refreshKey]);

    // --- TOGGLE FAVORITE ---
    const handleToggleFavorite = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/favorites/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId, movieId: Number(currentMovieId) })
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavorite(data.isFavorite); // Update UI based on backend response
            }
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    // --- SUBMIT REVIEW ---
    const handleSubmit = async () => {
        if (myRating === 0 && myComment.trim() === "") {
            alert("Please provide a rating or a comment!");
            return;
        }
        const payload = {
            userId: currentUserId,
            username: "Guest User",
            movieId: Number(currentMovieId),
            rating: myRating,
            comment: myComment
        };
        try {
            const response = await fetch("http://localhost:8080/api/reviews/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert("Review saved successfully!");
                setRefreshKey(old => old + 1);
            } else {
                alert("Failed.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="movie-detail-container">
            {/* Hero */}
            <section className="movie-hero-section">
                <div className="hero-background" style={{ backgroundImage: `url(${movie.imageUrl})` }}>
                    <div className="hero-content">
                        <h1>{movie.title}</h1>
                        <p className="movie-tagline">{movie.description}</p>

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button className="btn-trailer">Watch Trailer</button>

                            {/* HEART BUTTON */}
                            <button
                                className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                                onClick={handleToggleFavorite}
                                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                            >
                                ❤
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="interactive-content">
                <div className="rating-column">
                   <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>
                            {existingReviewId ? "Your Rating (Click to Change)" : "Rate this movie"}
                        </h3>
                        <div style={{ marginTop: '10px' }}>
                            <StarRating
                                rating={myRating}
                                onRatingChange={(newRating) => setMyRating(newRating)}
                                editable={true}
                            />
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '5px' }}>
                            {myRating > 0 ? `Selected: ${myRating}` : "Tap stars to rate"}
                        </p>
                   </div>
                </div>

                <div className="comment-column">
                    <section className="comment-section">
                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
                            {existingReviewId ? "Edit Your Review" : "Leave a Comment"}
                        </h3>
                        <textarea
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)}
                            placeholder="Write your review here..."
                            rows="4"
                        ></textarea>
                        <button className="btn-secondary" onClick={handleSubmit}>
                            {existingReviewId ? "Update Review" : "Submit Review"}
                        </button>
                    </section>
                    <ReviewsList key={refreshKey} movieId={currentMovieId} refreshTrigger={refreshKey} />
                </div>
            </section>

            {/* Tabs */}
            <div className="detail-tabs-nav">
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <button className="tab-btn active">Cast</button>
                    <button className="tab-btn">Crew</button>
                    <button className="tab-btn">Details</button>
                </div>
            </div>
            <div className="tab-content">
                <p>Cast, Crew, and Details data will be loaded here based on the selected tab.</p>
            </div>
        </div>
    );
};

export default MovieDetailPage;