import React from 'react';
import SearchBar from '../components/SearchBar'; // <-- Χρειάζεται να εισαχθεί
import TrendingSection from '../components/TrendingSection'; // <-- Χρειάζεται να εισαχθεί
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    // Το main τώρα είναι εδώ
    <main>
      <SearchBar />
      <TrendingSection title="Τάσεις Τώρα" />
      {/* Μόνο το περιεχόμενο που αλλάζει ανά σελίδα */}
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