import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';

const ReviewsList = ({ movieId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localRefresh, setLocalRefresh] = useState(0);

    // Reply State
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const currentUserId = "user123";

    // --- FETCH DATA ---
    // We listen to both refreshTrigger (from parent) and localRefresh (from delete/vote actions)
    useEffect(() => {
        fetch(`http://localhost:8080/api/reviews/movie/${movieId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.content || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setLoading(false);
            });
    }, [movieId, refreshTrigger, localRefresh]);

    // --- VOTE FUNCTION ---
    const handleVote = async (reviewId, type) => {
        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}/vote?userId=${currentUserId}&voteType=${type}`, {
                method: 'POST'
            });
            setLocalRefresh(old => old + 1);
        } catch (error) {
            console.error("Vote failed:", error);
        }
    };

    // --- REPLY FUNCTION ---
    const handleReplySubmit = async (reviewId) => {
        if (!replyContent.trim()) return;

        const payload = {
            userId: currentUserId,
            username: "Guest User",
            content: replyContent
        };

        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setReplyContent("");
            setActiveReplyId(null);
            setLocalRefresh(old => old + 1);
        } catch (error) {
            console.error("Reply failed:", error);
        }
    };

    // --- DELETE REVIEW FUNCTION ---
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}?userId=${currentUserId}`, {
                method: 'DELETE'
            });
            setLocalRefresh(old => old + 1);
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // --- DELETE REPLY FUNCTION ---
    const handleDeleteReply = async (replyId) => {
        if (!window.confirm("Delete this reply?")) return;
        try {
            await fetch(`http://localhost:8080/api/reviews/reply/${replyId}?userId=${currentUserId}`, {
                method: 'DELETE'
            });
            setLocalRefresh(old => old + 1);
        } catch (error) {
            console.error("Delete reply failed:", error);
        }
    };

    if (loading) return <p style={{ color: '#ddd' }}>Loading reviews...</p>;

    return (
        <div className="reviews-list-container" style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '10px', marginBottom: '20px' }}>
                User Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
                <p style={{ color: '#eee', fontStyle: 'italic' }}>No reviews yet.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {reviews.map((review) => (
                        <li key={review.id} className="review-item">

                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ color: '#90caf9', fontSize: '1.1rem', marginRight: '10px' }}>{review.username}</strong>
                                    {review.userId === currentUserId && <span style={{fontSize:'0.8rem', backgroundColor:'#546e7a', padding:'2px 6px', borderRadius:'4px'}}>YOU</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <small style={{ color: '#cfd8dc' }}>
                                        {/* Display UpdatedAt if edited, otherwise CreatedAt */}
                                        {review.edited ? `Edited: ${new Date(review.updatedAt).toLocaleDateString()}` : new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                    {review.userId === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            style={{background:'none', border:'none', cursor:'pointer', color:'#ef5350'}}
                                            title="Delete Review"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            {review.rating > 0 && (
                                <div style={{ margin: '5px 0' }}>
                                    <StarRating rating={review.rating} editable={false} />
                                </div>
                            )}

                            {/* Content */}
                            <p style={{ color: '#fff', marginTop: '8px', lineHeight: '1.5' }}>{review.comment}</p>

                            {/* Actions */}
                            <div className="review-actions">
                                <button className="action-btn" onClick={() => handleVote(review.id, 1)}>
                                    👍 {review.likeCount}
                                </button>
                                <button className="action-btn" onClick={() => handleVote(review.id, -1)}>
                                    👎 {review.dislikeCount}
                                </button>
                                <button className="action-btn reply-btn" onClick={() => setActiveReplyId(review.id === activeReplyId ? null : review.id)}>
                                    💬 Reply ({review.replyCount})
                                </button>
                            </div>

                            {/* Reply Form */}
                            {activeReplyId === review.id && (
                                <div className="reply-form">
                                    <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="reply-input"
                                    />
                                    <button className="btn-small" onClick={() => handleReplySubmit(review.id)}>Post</button>
                                </div>
                            )}

                            {/* Nested Replies */}
                            {review.replies && review.replies.length > 0 && (
                                <div className="replies-list">
                                    {review.replies.map(reply => (
                                        <div key={reply.id} className="reply-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <strong style={{ color: '#81d4fa' }}>{reply.username}</strong>
                                                <div style={{display:'flex', gap:'10px'}}>
                                                    <span style={{ color: '#b0bec5' }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                    {reply.userId === currentUserId && (
                                                        <button
                                                            onClick={() => handleDeleteReply(reply.id)}
                                                            style={{background:'none', border:'none', cursor:'pointer', color:'#ef5350', fontSize:'0.8rem'}}
                                                            title="Delete Reply"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p style={{ margin: '5px 0', color: '#eceff1' }}>{reply.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewsList;