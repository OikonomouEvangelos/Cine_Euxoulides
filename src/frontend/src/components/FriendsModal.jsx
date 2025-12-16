import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT για πλοήγηση
import './FriendsModal.css';

const FriendsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');

  // Lists
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  // Blend Results
  const [blendMovies, setBlendMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api';
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate(); // 2. Hook για πλοήγηση

  // --- ΦΟΡΤΩΣΗ ΔΕΔΟΜΕΝΩΝ ---
  useEffect(() => {
    if (!userId) return;

    if (activeTab === 'requests') {
      fetch(`${API_URL}/friends/requests?userId=${userId}`)
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(err => console.error("Error fetching requests:", err));
    }

    if (activeTab === 'list') {
      fetch(`${API_URL}/friends/list?userId=${userId}`)
        .then(res => res.json())
        .then(data => setFriends(data))
        .catch(err => console.error("Error fetching friends:", err));
    }
  }, [activeTab, userId]);


  // Actions...
  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!userId) return setMessage('Σφάλμα: Δεν βρέθηκε ID χρήστη.');
    try {
      const res = await fetch(`${API_URL}/friends/request?senderId=${userId}&receiverEmail=${emailInput}`, { method: 'POST' });
      const text = await res.text();
      setMessage(res.ok ? `Επιτυχία: ${text}` : `Σφάλμα: ${text}`);
      if (res.ok) setEmailInput('');
    } catch (err) { setMessage('Αποτυχία σύνδεσης.'); }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/friends/accept?requestId=${requestId}`, { method: 'POST' });
      if (res.ok) setRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/friends/reject?requestId=${requestId}`, { method: 'POST' });
      if (res.ok) setRequests(prev => prev.filter(req => req.requestId !== requestId));
    } catch (err) { console.error(err); }
  };

  const handleBlend = async (friendId) => {
    setIsLoading(true);
    setBlendMovies(null);
    try {
      const res = await fetch(`${API_URL}/blend/generate?user1Id=${userId}&user2Id=${friendId}`);
      if (res.ok) {
        const data = await res.json();
        setBlendMovies(data.results || []);
        setActiveTab('blend_results');
      } else {
        alert("Δεν βρέθηκαν αρκετά δεδομένα για Blend!");
      }
    } catch (err) {
      console.error(err);
      alert("Σφάλμα στο Blend.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Νέα συνάρτηση για κλικ σε ταινία
  const handleMovieClick = (movieId) => {
    onClose(); // Κλείνουμε το modal
    navigate(`/movie/${movieId}`); // Πηγαίνουμε στη σελίδα της ταινίας
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        <h2>Διαχείριση Φίλων</h2>

        {/* --- TABS --- */}
        <div className="modal-tabs">
          <button className={activeTab === 'add' ? 'active' : ''} onClick={() => setActiveTab('add')}>➕ Προσθήκη</button>
          <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>
            📩 Αιτήματα {requests.length > 0 && <span className="badge">{requests.length}</span>}
          </button>
          <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>👥 Φίλοι</button>
          {activeTab === 'blend_results' && (
            <button className="active">🧬 Blend Results</button>
          )}
        </div>

        {/* --- ADD --- */}
        {activeTab === 'add' && (
          <div className="tab-content">
            <p style={{color: '#cbd5e1', marginBottom: '10px'}}>Εισάγετε το email του φίλου σας:</p>
            <form onSubmit={handleSendRequest}>
              <input type="email" placeholder="email@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
              <button type="submit" className="action-btn">Αποστολή Αιτήματος</button>
            </form>
            {message && <p style={{marginTop: '10px', color: message.startsWith('Επιτυχία') ? '#4ade80' : '#ef5350'}}>{message}</p>}
          </div>
        )}

        {/* --- REQUESTS --- */}
        {activeTab === 'requests' && (
          <div className="tab-content">
            {requests.length === 0 ? <p style={{color: '#94a3b8'}}>Δεν υπάρχουν εκκρεμή αιτήματα.</p> : (
              <ul>
                {requests.map(req => (
                  <li key={req.requestId} className="friend-item">
                    <div className="friend-info">
                      <div>
                        <strong>{req.senderName}</strong>
                        <small>{req.senderEmail}</small>
                      </div>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <button className="action-btn" style={{padding:'5px 10px', background:'#22c55e'}} onClick={() => handleAccept(req.requestId)}>✔</button>
                      <button className="action-btn" style={{padding:'5px 10px', background:'#ef4444'}} onClick={() => handleReject(req.requestId)}>✖</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* --- LIST --- */}
        {activeTab === 'list' && (
          <div className="tab-content">
            {isLoading && <p style={{textAlign:'center', color:'#60a5fa'}}>Γίνεται επεξεργασία Blend...</p>}
            {!isLoading && friends.length === 0 ? <p style={{color: '#94a3b8'}}>Δεν έχετε προσθέσει φίλους.</p> : (
              <ul>
                {friends.map(friend => (
                  <li key={friend.id} className="friend-item">
                    <div className="friend-info">
                      <div className="avatar-circle">{friend.firstName ? friend.firstName[0] : 'U'}</div>
                      <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                    <button className="blend-btn" onClick={() => handleBlend(friend.id)}>🧬 Blend</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* --- BLEND RESULTS --- */}
        {activeTab === 'blend_results' && (
          <div className="tab-content">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px'}}>
                <button className="back-btn" onClick={() => setActiveTab('list')}>⬅ Επιστροφή</button>
                <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>Top Picks for You</span>
            </div>

            <div className="blend-results-grid">
              {blendMovies && blendMovies.map(movie => (
                // 4. Προσθήκη του onClick εδώ
                <div
                    key={movie.id}
                    className="movie-card-blend"
                    title={movie.title}
                    onClick={() => handleMovieClick(movie.id)}
                >
                   <img
                      src={movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Poster'}
                      alt={movie.title}
                   />
                   <div className="movie-info-blend">
                      <div className="movie-title">{movie.title}</div>
                      <div className="movie-meta">
                        <span className="rating">★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}</span>
                        <span>{movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            {blendMovies && blendMovies.length === 0 && (
                <p style={{textAlign:'center', color:'#94a3b8', marginTop:'20px'}}>Δεν βρέθηκαν κοινά αποτελέσματα.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FriendsModal;