import React, { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { getAuthHeaders, getCurrentUserId } from '../services/auth';

const ReviewsList = ({ movieId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localRefresh, setLocalRefresh] = useState(0);

    // Edit Review State
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editContent, setEditContent] = useState("");

    // Edit Reply State (NEW)
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyContent, setEditReplyContent] = useState("");

    // Reply State
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const currentUserId = String(getCurrentUserId());

    useEffect(() => {
        const headers = getAuthHeaders();
        fetch(`http://localhost:8080/api/reviews/movie/${movieId}`, { headers })
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

    const handleVote = async (reviewId, type) => {
        if (!currentUserId || currentUserId === "null") { alert("Please login to vote!"); return; }
        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}/vote?voteType=${type}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            setLocalRefresh(old => old + 1);
        } catch (error) { console.error("Vote failed:", error); }
    };

    // --- REVIEW EDIT LOGIC ---
    const startEdit = (review) => {
        setEditingReviewId(review.id);
        setEditContent(review.comment);
    };

    const cancelEdit = () => {
        setEditingReviewId(null);
        setEditContent("");
    };

    const saveEdit = async () => {
        try {
            await fetch("http://localhost:8080/api/reviews/add", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ movieId: movieId, comment: editContent })
            });
            setEditingReviewId(null);
            setLocalRefresh(old => old + 1);
        } catch (e) { console.error(e); }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}`, { method: 'DELETE', headers: getAuthHeaders() });
            setLocalRefresh(old => old + 1);
        } catch (error) { console.error(error); }
    };

    // --- REPLY CREATE LOGIC ---
    const handleReplySubmit = async (reviewId) => {
        if (!currentUserId) { alert("Please login!"); return; }
        if (!replyContent.trim()) return;
        try {
            await fetch(`http://localhost:8080/api/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ content: replyContent })
            });
            setReplyContent("");
            setActiveReplyId(null);
            setLocalRefresh(old => old + 1);
        } catch (e) { console.error(e); }
    };

    // --- REPLY EDIT/DELETE LOGIC (NEW) ---
    const startEditReply = (reply) => {
        setEditingReplyId(reply.id);
        setEditReplyContent(reply.content);
    };

    const saveEditReply = async () => {
        try {
            await fetch(`http://localhost:8080/api/reviews/reply/${editingReplyId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ content: editReplyContent })
            });
            setEditingReplyId(null);
            setLocalRefresh(old => old + 1);
        } catch (e) { console.error(e); }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm("Delete this reply?")) return;
        try {
            await fetch(`http://localhost:8080/api/reviews/reply/${replyId}`, { method: 'DELETE', headers: getAuthHeaders() });
            setLocalRefresh(old => old + 1);
        } catch (e) { console.error(e); }
    };

    if (loading) return <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading reviews...</p>;

    return (
        <div className="reviews-list-container">
            {reviews.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>No reviews yet. Be the first!</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {reviews.map((review) => {
                        const isAuthor = review.userId === currentUserId;
                        const userVote = review.currentUserVote || 0;

                        return (
                            <li key={review.id} style={{marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>

                                {/* REVIEW HEADER */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'5px' }}>
                                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                        <strong style={{ color: '#60a5fa', fontSize: '0.95rem' }}>{review.username}</strong>
                                        {review.rating > 0 && (
                                            <div style={{transform: 'scale(0.6)', transformOrigin: 'left center', display:'flex'}}>
                                                <StarRating rating={review.rating} />
                                            </div>
                                        )}
                                        <span style={{ color: '#475569', fontSize: '0.8rem' }}>•</span>
                                        <small style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                            {review.isEdited && <span style={{fontStyle:'italic', marginLeft:'4px'}}>(Edited)</span>}
                                        </small>
                                    </div>

                                    {isAuthor && (
                                        <div style={{display:'flex', gap:'8px'}}>
                                            <button onClick={() => startEdit(review)} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:'0.75rem'}}>Edit</button>
                                            <button onClick={() => handleDeleteReview(review.id)} style={{background:'none', border:'none', cursor:'pointer', color:'#ef5350', fontSize:'0.75rem'}}>Delete</button>
                                        </div>
                                    )}
                                </div>

                                {/* REVIEW CONTENT */}
                                {editingReviewId === review.id ? (
                                    <div style={{marginTop:'5px'}}>
                                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{width:'100%', padding:'8px', borderRadius:'4px', border:'1px solid #475569', background:'#1e293b', color:'#e2e8f0', fontSize:'0.9rem'}}/>
                                        <div style={{marginTop:'5px', display:'flex', gap:'10px'}}>
                                            <button onClick={saveEdit} className="btn-submit-rating" style={{padding:'4px 10px', fontSize:'0.75rem', width:'auto'}}>Save</button>
                                            <button onClick={cancelEdit} style={{background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'0.75rem'}}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ color: '#e2e8f0', margin: '0 0 8px 0', lineHeight: '1.5', fontSize:'0.95rem', whiteSpace: 'pre-wrap' }}>{review.comment}</p>
                                )}

                                {/* ACTIONS */}
                                <div style={{display: 'flex', gap: '12px', alignItems:'center'}}>
                                    <button onClick={() => handleVote(review.id, 1)} style={{background:'none', border:'none', color: userVote === 1 ? '#60a5fa' : '#64748b', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontSize:'0.8rem', padding:0}}>
                                        👍 {review.likeCount}
                                    </button>
                                    <button onClick={() => handleVote(review.id, -1)} style={{background:'none', border:'none', color: userVote === -1 ? '#ef5350' : '#64748b', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', fontSize:'0.8rem', padding:0}}>
                                        👎 {review.dislikeCount}
                                    </button>
                                    <button onClick={() => setActiveReplyId(review.id === activeReplyId ? null : review.id)} style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize:'0.8rem', padding:0}}>
                                        Reply ({review.replyCount})
                                    </button>
                                </div>

                                {/* REPLY INPUT */}
                                {activeReplyId === review.id && (
                                    <div style={{marginTop: '10px', paddingLeft:'15px', borderLeft:'2px solid #334155'}}>
                                        <input type="text" placeholder="Write a reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} style={{width:'80%', padding:'6px', borderRadius:'4px', border:'1px solid #475569', background:'#1e293b', color:'white', fontSize:'0.9rem', marginRight:'8px'}}/>
                                        <button onClick={() => handleReplySubmit(review.id)} style={{padding: '6px 10px', borderRadius: '4px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontSize:'0.8rem'}}>Post</button>
                                    </div>
                                )}

                                {/* NESTED REPLIES */}
                                {review.replies && review.replies.length > 0 && (
                                    <div style={{marginLeft: '20px', marginTop: '10px'}}>
                                        {review.replies.map(reply => {
                                            const isReplyAuthor = reply.userId === currentUserId;
                                            return (
                                                <div key={reply.id} style={{marginBottom: '8px', paddingLeft:'10px', borderLeft:'1px solid rgba(255,255,255,0.1)'}}>

                                                    {/* REPLY HEADER */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ display: 'flex', gap:'8px', alignItems:'baseline', fontSize: '0.8rem' }}>
                                                            <strong style={{ color: '#93c5fd' }}>{reply.username}</strong>
                                                            <span style={{ color: '#475569' }}>
                                                                {new Date(reply.createdAt).toLocaleDateString()}
                                                                {reply.isEdited && <span style={{fontStyle:'italic', marginLeft:'4px'}}>(Edited)</span>}
                                                            </span>
                                                        </div>
                                                        {/* REPLY ACTIONS */}
                                                        {isReplyAuthor && (
                                                            <div style={{display:'flex', gap:'6px'}}>
                                                                <button onClick={() => startEditReply(reply)} style={{background:'none', border:'none', cursor:'pointer', color:'#64748b', fontSize:'0.7rem'}}>Edit</button>
                                                                <button onClick={() => handleDeleteReply(reply.id)} style={{background:'none', border:'none', cursor:'pointer', color:'#ef5350', fontSize:'0.7rem'}}>Delete</button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* REPLY CONTENT */}
                                                    {editingReplyId === reply.id ? (
                                                        <div style={{marginTop:'5px'}}>
                                                            <input value={editReplyContent} onChange={(e) => setEditReplyContent(e.target.value)} style={{width:'90%', padding:'4px', borderRadius:'4px', border:'1px solid #475569', background:'#1e293b', color:'white', fontSize:'0.85rem'}}/>
                                                            <div style={{marginTop:'4px'}}>
                                                                <button onClick={saveEditReply} style={{color:'#60a5fa', background:'none', border:'none', fontSize:'0.75rem', cursor:'pointer', marginRight:'8px'}}>Save</button>
                                                                <button onClick={() => setEditingReplyId(null)} style={{color:'#94a3b8', background:'none', border:'none', fontSize:'0.75rem', cursor:'pointer'}}>Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p style={{ margin: '2px 0', color: '#cbd5e1', fontSize:'0.9rem' }}>{reply.content}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ReviewsList;