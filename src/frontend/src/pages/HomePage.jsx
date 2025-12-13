import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieRow from '../components/MovieRow';
import MoodScanner from '../components/MoodScanner';
import MoodScannerButton from '../components/MoodScannerButton';
import { isAuthenticated } from '../services/auth';

const HomePage = () => {
  const [showScanner, setShowScanner] = useState(false);

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

        {/* LEFT: Side-by-Side Floating Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>

            {/* 1. Quiz Icon (Now on the LEFT) */}
            <Link
                to="/quiz"
                className="quiz-landing-spot"
                title="Play Movie Quiz"
                style={{
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                    /* Force relative positioning to stop it from jumping */
                    position: 'relative',
                    left: 'auto',
                    right: 'auto',
                    top: 'auto',
                    bottom: 'auto'
                }}
            >
                <span role="img" aria-label="Quiz" style={{ fontSize: '28px', cursor: 'pointer' }}>❓</span>
            </Link>

            {/* 2. Mood Scanner (Now on the RIGHT) */}
            <MoodScannerButton onClick={() => setShowScanner(true)} />

        </div>

        {/* RIGHT: Search */}
        <div style={{ width: '400px' }}>
            <SearchBar />
        </div>

      </div>

      {/* --- POPUP SCANNER --- */}
      {showScanner && (
        <MoodScanner onClose={() => setShowScanner(false)} />
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