// src/pages/WelcomePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';


const WelcomePage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [posters, setPosters] = useState([]);
  const [firstName, setFirstName] = useState('');   // Όνομα
  const [lastName, setLastName] = useState('');     // Επώνυμο
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');




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

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignIn) {
        // LOGIN
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
        });

        console.log('Login success:', response.data);
        const data = response.data;

        // Αποθηκεύουμε το token & λίγα στοιχεία χρήστη
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userFirstName', data.firstName);
        }

        navigate('/browse');

      } else {
        // REGISTER
        const response = await axios.post('http://localhost:8080/api/auth/register', {
          firstName,
          lastName,
          email,
          password
        });

        console.log('Register success:', response.data);

        const data = response.data;

        // Αποθηκεύουμε το token & λίγα στοιχεία χρήστη
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userFirstName', data.firstName);
        }

        navigate('/browse');
      }

    } catch (error) {
      console.error('Auth error:', error);
      alert('Λάθος στοιχεία ή πρόβλημα σύνδεσης');
    }
  };


const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const idToken = credentialResponse?.credential;
    console.log('Google ID Token:', idToken);

    if (!idToken) {
      alert('Δεν λάβαμε token από το Google.');
      return;
    }

    // Στέλνουμε το idToken στον backend στο /api/auth/google
    const res = await axios.post('http://localhost:8080/api/auth/google', {
      idToken,
    });

    const data = res.data;
    console.log('Google login backend response:', data);

    // Αν ο backend μας έστειλε JWT token, το αποθηκεύουμε όπως και στο κλασικό login
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userFirstName', data.firstName);
      localStorage.setItem('userLastName', data.lastName || '');
    }

    // Πάμε στην “κανονική” εφαρμογή
    navigate('/browse');
  } catch (err) {
    console.error('Google login failed:', err);
    alert('Αποτυχία σύνδεσης με Google');
  }
};
;



  const handleGoogleError = () => {
    console.error('Google Login Failed');
    alert('Αποτυχία σύνδεσης με Google');
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

        {!isSignIn && (
          <>
            {/* Πεδίο Όνομα */}
            <div className="input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>Όνομα</label>
            </div>

            {/* Πεδίο Επώνυμο */}
            <div className="input-group">
              <input
                type="text"
                required
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Επώνυμο</label>
            </div>
          </>
        )}


        <form onSubmit={handleAuth}>
          <div className="input-group">
            <input type="email"
            required
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input type="password"
            required
            placeholder=" "
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             />
            <label>Κωδικός πρόσβασης</label>
          </div>

          <button type="submit" className="auth-btn">
            {isSignIn ? 'Είσοδος' : 'Εγγραφή'}
          </button>
        </form>

        <div className="separator">ή</div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>


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