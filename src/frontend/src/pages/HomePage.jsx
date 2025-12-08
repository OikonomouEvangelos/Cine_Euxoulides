import React from 'react';
import { Link } from 'react-router-dom';

// Υπάρχοντα components
import SearchBar from '../components/SearchBar';
import TrendingSection from '../components/TrendingSection';

// Νέο component για τις λίστες ταινιών
import MovieRow from '../components/MovieRow';

const HomePage = () => {

  // URLs για το API (TMDB)
  // Προσθέτουμε ? στο τέλος ώστε να κολλήσει σωστά το &api_key που βάζει το MovieRow
  const requests = {
    topRated: `https://api.themoviedb.org/3/movie/top_rated?`,
    action: `https://api.themoviedb.org/3/discover/movie?with_genres=28`,
    comedy: `https://api.themoviedb.org/3/discover/movie?with_genres=35`,
    horror: `https://api.themoviedb.org/3/discover/movie?with_genres=27`,
    romance: `https://api.themoviedb.org/3/discover/movie?with_genres=10749`,
    documentaries: `https://api.themoviedb.org/3/discover/movie?with_genres=99`,
  };

  return (
    <main>
      {/* 1. Η Αναζήτηση (Υπήρχε) */}
      <SearchBar />

      {/* 2. Το Trending Section (Υπήρχε) */}
      <TrendingSection title="Τάσεις Τώρα" />

      {/* 3. ΟΙ ΝΕΕΣ ΛΙΣΤΕΣ (Προστέθηκαν εδώ) */}
      <div className="movie-rows-container" style={{ marginTop: '20px' }}>
        <MovieRow title="Κορυφαία Βαθμολογία" fetchUrl={requests.topRated} />
        <MovieRow title="Δράση & Περιπέτεια" fetchUrl={requests.action} />
        <MovieRow title="Κωμωδίες" fetchUrl={requests.comedy} />
        <MovieRow title="Ταινίες Τρόμου" fetchUrl={requests.horror} />
        <MovieRow title="Ρομαντικές" fetchUrl={requests.romance} />
        <MovieRow title="Ντοκιμαντέρ" fetchUrl={requests.documentaries} />
      </div>

      {/* 4. Το Quiz Button (Υπήρχε) */}
      <Link to="/quiz" className="quiz-landing-spot">
        <div className="quiz-content">
            <div className="quiz-icon-container">
                <div className="quiz-icon">
                    <span role="img" aria-label="Ερωτηματικό">❓</span>
                </div>
                <div className="quiz-ring"></div>
            </div>
        </div>
      </Link>

    </main>
  );
};

export default HomePage;