// src/pages/WelcomePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [posters, setPosters] = useState([]);

  // Fetch Posters για το Background
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    if (!API_KEY) return;

    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        // Κρατάμε πολλές ταινίες για να γεμίσουν οι στήλες
        setPosters([...data.results, ...data.results]);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/browse');
  };

  const handleGoogleLogin = () => {
    navigate('/browse');
  };

  return (
    <div className="welcome-container">

      {/* --- ΤΟ ΝΕΟ ΠΡΩΤΟΠΟΡΙΑΚΟ BACKGROUND --- */}
      <div className="cinematic-bg">
        <div className="bg-overlay"></div> {/* Σκοτεινό φίλτρο */}

        <div className="posters-wrapper">
          {/* Στήλη 1: Κινείται προς τα πάνω */}
          <div className="poster-column col-1">
            {posters.map((movie, i) => (
              <img key={`c1-${i}`} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
            ))}
          </div>

          {/* Στήλη 2: Κινείται προς τα κάτω (πιο αργά) */}
          <div className="poster-column col-2">
            {posters.map((movie, i) => (
              <img key={`c2-${i}`} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
            ))}
          </div>

          {/* Στήλη 3: Κινείται προς τα πάνω */}
          <div className="poster-column col-3">
            {posters.map((movie, i) => (
              <img key={`c3-${i}`} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="welcome-header">
        <h1>CineEuxoulides</h1>
      </header>

      {/* Φόρμα (ίδια με πριν) */}
      <div className="auth-box">
        <h2>{isSignIn ? 'Σύνδεση' : 'Εγγραφή'}</h2>

        <form onSubmit={handleAuth}>
          <div className="input-group">
            <input type="email" required placeholder=" " />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input type="password" required placeholder=" " />
            <label>Κωδικός πρόσβασης</label>
          </div>

          <button type="submit" className="auth-btn">
            {isSignIn ? 'Είσοδος' : 'Εγγραφή'}
          </button>
        </form>

        <div className="separator">ή</div>

        <button type="button" className="google-btn" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.716H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.157 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Συνέχεια με Google
        </button>

        <div className="auth-footer">
          {isSignIn ? (
            <p>Νέος εδώ; <span onClick={() => setIsSignIn(false)}>Δημιουργία λογαριασμού</span></p>
          ) : (
            <p>Έχετε ήδη λογαριασμό; <span onClick={() => setIsSignIn(true)}>Συνδεθείτε</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;