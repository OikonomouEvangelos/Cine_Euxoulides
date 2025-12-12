import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';
import MovieRow from '../components/MovieRow';
import { isAuthenticated } from '../services/auth'; // Import για έλεγχο σύνδεσης

const HomePage = () => {

  // URLs για το API (TMDB)
  const requests = {
    topRated: `https://api.themoviedb.org/3/movie/top_rated?`,
    action: `https://api.themoviedb.org/3/discover/movie?with_genres=28`,
    comedy: `https://api.themoviedb.org/3/discover/movie?with_genres=35`,
    horror: `https://api.themoviedb.org/3/discover/movie?with_genres=27`,
    romance: `https://api.themoviedb.org/3/discover/movie?with_genres=10749`,
    documentaries: `https://api.themoviedb.org/3/discover/movie?with_genres=99`,
  };

  // URL για το δικό μας Backend (Recommendations)
  const recommendationUrl = 'http://localhost:8080/api/recommendations';

  return (
    <main>

      {/* --- 1. HEADER TOOLBAR (Quiz Αριστερά - Search Δεξιά) --- */}
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          width: '100%',
          boxSizing: 'border-box'
      }}>

        {/* ΑΡΙΣΤΕΡΑ: Το κουμπί Quiz */}
        <Link to="/quiz" className="quiz-landing-spot" style={{
            position: 'relative',
            bottom: 'auto',
            right: 'auto',
            margin: 0,
            textDecoration: 'none'
        }}>
          <div className="quiz-content">
              <div className="quiz-icon-container">
                  <div className="quiz-icon">
                      <span role="img" aria-label="Ερωτηματικό">❓</span>
                  </div>
                  <div className="quiz-ring"></div>
              </div>
          </div>
        </Link>

        {/* ΔΕΞΙΑ: Η Αναζήτηση */}
        <div style={{ width: '400px' }}>
            <SearchBar />
        </div>

      </div>
      {/* ---------------------------------------------------- */}


      {/* 2. Το Trending Section */}
      <TrendingSection title="Τάσεις Τώρα" />

      {/* 3. ΟΙ ΛΙΣΤΕΣ ΤΑΙΝΙΩΝ */}
      <div className="movie-rows-container" style={{ marginTop: '20px' }}>

        {/* --- ΝΕΟ: ΣΕΙΡΑ ΠΡΟΤΑΣΕΩΝ --- */}
        {/* Εμφανίζεται ΜΟΝΟ αν ο χρήστης είναι συνδεδεμένος */}
        {isAuthenticated() && (
            <MovieRow
                title="Προτεινόμενα για Εσάς"
                fetchUrl={recommendationUrl}
            />
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