import React, { useState, useEffect } from 'react';
import './FriendsModal.css';

const FriendsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');

  // Αρχικοποίηση με κενά arrays (ΟΧΙ ψεύτικα δεδομένα πλέον)
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const API_URL = 'http://localhost:8080/api/friends';
  const userId = localStorage.getItem('userId'); // Το ID του συνδεδεμένου χρήστη

  // --- ΦΟΡΤΩΣΗ ΔΕΔΟΜΕΝΩΝ ΑΝΑΛΟΓΑ ΤΗΝ ΚΑΡΤΕΛΑ ---
  useEffect(() => {
    if (!userId) return;

    if (activeTab === 'requests') {
      fetch(`${API_URL}/requests?userId=${userId}`)
        .then(res => res.json())
        .then(data => setRequests(data))
        .catch(err => console.error("Error fetching requests:", err));
    }

    if (activeTab === 'list') {
      fetch(`${API_URL}/list?userId=${userId}`)
        .then(res => res.json())
        .then(data => setFriends(data))
        .catch(err => console.error("Error fetching friends:", err));
    }
  }, [activeTab, userId]);


  // 1. ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ
  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!userId) return setMessage('Σφάλμα: Δεν βρέθηκε ID χρήστη.');

    try {
      const res = await fetch(`${API_URL}/request?senderId=${userId}&receiverEmail=${emailInput}`, {
        method: 'POST'
      });

      const text = await res.text(); // Διαβάζουμε το μήνυμα από τον Server
      if (res.ok) {
        setMessage(`Επιτυχία: ${text}`);
        setEmailInput('');
      } else {
        setMessage(`Σφάλμα: ${text}`);
      }
    } catch (err) {
      setMessage('Αποτυχία σύνδεσης με τον server.');
    }
  };

  // 2. ΑΠΟΔΟΧΗ ΑΙΤΗΜΑΤΟΣ
  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/accept?requestId=${requestId}`, { method: 'POST' });
      if (res.ok) {
        // Αφού αποδεχτούμε, αφαιρούμε το αίτημα από τη λίστα τοπικά
        setRequests(prev => prev.filter(req => req.requestId !== requestId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. ΑΠΟΡΡΙΨΗ ΑΙΤΗΜΑΤΟΣ
  const handleReject = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/reject?requestId=${requestId}`, { method: 'POST' });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.requestId !== requestId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        <h2>Διαχείριση Φίλων</h2>

        {/* --- TABS --- */}
        <div className="modal-tabs">
          <button
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            ➕ Προσθήκη
          </button>
          <button
            className={activeTab === 'requests' ? 'active' : ''}
            onClick={() => setActiveTab('requests')}
          >
            📩 Αιτήματα {requests.length > 0 && <span className="badge">{requests.length}</span>}
          </button>
          <button
            className={activeTab === 'list' ? 'active' : ''}
            onClick={() => setActiveTab('list')}
          >
            👥 Οι Φίλοι μου
          </button>
        </div>

        {/* --- CONTENT: ΠΡΟΣΘΗΚΗ --- */}
        {activeTab === 'add' && (
          <div className="tab-content add-section">
            <p>Εισάγετε το email του φίλου σας:</p>
            <form onSubmit={handleSendRequest}>
              <input
                type="email"
                placeholder="email@filou.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button type="submit" className="action-btn">Αποστολή</button>
            </form>
            {message && <p className="status-message">{message}</p>}
          </div>
        )}

        {/* --- CONTENT: ΑΙΤΗΜΑΤΑ (REAL DATA) --- */}
        {activeTab === 'requests' && (
          <div className="tab-content list-section">
            {requests.length === 0 ? <p>Δεν υπάρχουν εκκρεμή αιτήματα.</p> : (
              <ul>
                {requests.map(req => (
                  <li key={req.requestId} className="friend-item">
                    <div className="friend-info">
                      <strong>{req.senderName}</strong>
                      <small>{req.senderEmail}</small>
                    </div>
                    <div className="actions">
                      <button className="accept-btn" onClick={() => handleAccept(req.requestId)}>✔</button>
                      <button className="reject-btn" onClick={() => handleReject(req.requestId)}>✖</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* --- CONTENT: ΛΙΣΤΑ ΦΙΛΩΝ (REAL DATA) --- */}
        {activeTab === 'list' && (
          <div className="tab-content list-section">
            {friends.length === 0 ? <p>Δεν έχετε προσθέσει φίλους ακόμα.</p> : (
              <ul>
                {friends.map(friend => (
                  <li key={friend.id} className="friend-item">
                    <div className="friend-info">
                      <div className="avatar-circle">{friend.firstName ? friend.firstName[0] : 'U'}</div>
                      <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                    <button className="blend-btn" title="Movie Blend">🧬 Blend</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FriendsModal;