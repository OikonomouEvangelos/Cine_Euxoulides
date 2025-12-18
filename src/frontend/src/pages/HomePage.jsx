import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieRow from '../components/MovieRow';
import MoodScanner from '../components/MoodScanner';
import MoodScannerButton from '../components/MoodScannerButton';
import LookalikeScanner from '../components/ui/LookalikeScanner';
import { isAuthenticated } from '../services/auth';

const HomePage = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showLookalike, setShowLookalike] = useState(false);

  // TMDB API URLs
  const requests = {
    topRated: `https://api.themoviedb.org/3/movie/top_rated?`,
    action: `https://api.themoviedb.org/3/discover/movie?with_genres=28`,
    comedy: `https://api.themoviedb.org/3/discover/movie?with_genres=35`,
    horror: `https://api.themoviedb.org/3/discover/movie?with_genres=27`,
    romance: `https://api.themoviedb.org/3/discover/movie?with_genres=10749`,
    documentaries: `https://api.themoviedb.org/3/discover/movie?with_genres=99`,
  };

  const recommendationUrl = 'http://localhost:8080/api/recommendations';

  return (
    <main>

      {/* --- HEADER TOOLBAR --- */}
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          width: '100%',
          boxSizing: 'border-box',
          background: 'transparent',
          position: 'relative',
          zIndex: 10
      }}>

        {/* --- ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: Quiz & Mood Scanner --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>

            {/* 1. Quiz Icon */}
            <Link
                to="/quiz"
                className="quiz-landing-spot"
                title="Play Movie Quiz"
                style={{
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    position: 'relative',
                    top: 'auto',
                    left: 'auto',
                    right: 'auto',
                    bottom: 'auto',
                    margin: '0',
                    transform: 'none'
                }}
            >
                <span role="img" aria-label="Quiz" style={{ fontSize: '28px', cursor: 'pointer' }}>❓</span>
            </Link>

            {/* 2. Mood Scanner */}
            <MoodScannerButton onClick={() => setShowScanner(true)} />
        </div>


        {/* --- ΔΕΞΙΑ ΠΛΕΥΡΑ: Actor Shazam & Search --- */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
        }}>

            {/* Actor Shazam Button (ΓΚΡΙ/ΔΙΑΦΑΝΕΣ) */}
            <button
                onClick={() => setShowLookalike(true)}
                style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Επαναφορά χρώματος
                    border: '1px solid rgba(255, 255, 255, 0.2)', // Λεπτό περίγραμμα
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                title="Βρες με ποιον ηθοποιό μοιάζεις!"
            >
                <span style={{ fontSize: '1.2rem' }}>🎭</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>Actor Shazam</span>
            </button>

            {/* Search Bar */}
            <div style={{ width: '350px' }}>
                <SearchBar />
            </div>

        </div>

      </div>

      {/* --- POPUPS --- */}
      {showScanner && (
        <MoodScanner onClose={() => setShowScanner(false)} />
      )}

      {showLookalike && (
        <LookalikeScanner onClose={() => setShowLookalike(false)} />
      )}

      {/* CONTENT SECTIONS */}
      <div style={{ marginTop: '-10px' }}>
          <TrendingSection title="Τάσεις Τώρα" />
      </div>

      <div className="movie-rows-container" style={{ marginTop: '20px' }}>
        {isAuthenticated() && (
            <MovieRow title="Προτεινόμενα για Εσάς" fetchUrl={recommendationUrl} />
        )}
        <MovieRow title="Κορυφαία Βαθμολογία" fetchUrl={requests.topRated} />
        <MovieRow title="Δράση & Περιπέτεια" fetchUrl={requests.action} />
        <MovieRow title="Κωμωδίες" fetchUrl={requests.comedy} />
        <MovieRow title="Ταινίες Τρόμου" fetchUrl={requests.horror} />
        <MovieRow title="Ρομαντικές" fetchUrl={requests.romance} />
        <MovieRow title="Ντοκιμαντέρ" fetchUrl={requests.documentaries} />
      </div>

    </main>
  );
};

export default HomePage;