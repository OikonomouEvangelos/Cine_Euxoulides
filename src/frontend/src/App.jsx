// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Χρειάζεται το Link για το Quiz Spot
// --- ΝΕΑ IMPORTS QUIZ ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';

// Υπάρχοντα Components
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';

// Υπάρχουσες Σελίδες
import HomePage from './pages/HomePage'; // <-- Χρησιμοποιούμε αυτό ως /
import MovieDetailPage from './pages/MovieDetailPage';

// --- ΛΟΙΠΑ IMPORTS ΚΑΤΗΓΟΡΙΩΝ ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies';

import './App.css';

const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">

      <Header onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {isMenuOpen && <div className="sidemenu-overlay" onClick={closeMenu}></div>}

      <Routes>

        {/* --- ΒΑΣΙΚΕΣ ΣΕΛΙΔΕΣ --- */}
        {/* ΔΙΑΤΗΡΟΥΜΕ ΤΟ HOMEPAGE ΚΑΙ ΔΙΑΓΡΑΦΟΥΜΕ ΤΟ PLACEHOLDERHOMEPAGE */}
        <Route path="/" element={<HomePage />} />

        {/* ΔΙΑΤΗΡΟΥΜΕ ΤΗ ΔΙΑΔΡΟΜΗ ΤΑΙΝΙΑΣ (ΑΦΑΙΡΕΣΗ ΤΗΣ ΔΙΠΛΗΣ) */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* --- ΚΑΤΗΓΟΡΙΕΣ ΤΑΙΝΙΩΝ --- */}
        <Route path="/movies" element={<MovieCategories />} />
        <Route path="/movies/:genreId" element={<GenreMovies />} />

        {/* --- ΗΘΟΠΟΙΟΙ --- */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />

        {/* --- ΣΚΗΝΟΘΕΤΕΣ --- */}
        <Route path="/directors/:directorId" element={<DirectorMovies />} />

        {/* --- ΧΡΟΝΟΛΟΓΙΑ --- */}
        <Route path="/year/:year" element={<YearMovies />} />

        {/* --- QUIZ (ΔΙΑΤΗΡΟΥΜΕ) --- */}
        <Route path="/quiz" element={<QuizSelectionPage />} />
        <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />

        {/* --- ΑΥΤΕΣ ΟΙ ΔΙΑΔΡΟΜΕΣ ΔΙΑΓΡΑΦΟΝΤΑΙ ΩΣ ΔΙΠΛΕΣ/ΑΝΤΙΚΡΟΥΟΜΕΝΕΣ: ---
        <Route path="/" element={<PlaceholderHomePage />} />  <- ΠΡΟΚΑΛΕΙ ΤΟ ERROR
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        */}


      </Routes>

      <Footer />
    </div>
  );
};

export default App;