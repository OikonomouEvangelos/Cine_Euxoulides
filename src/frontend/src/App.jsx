// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Υπάρχοντα Components
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';

// Υπάρχουσες Σελίδες
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';

// --- ΝΕΑ IMPORTS (Όλες οι λειτουργίες που φτιάξαμε) ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies'; // <--- ΝΕΟ: Για τη χρονολογία

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
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* --- ΚΑΤΗΓΟΡΙΕΣ ΤΑΙΝΙΩΝ --- */}
        <Route path="/movies" element={<MovieCategories />} />
        <Route path="/movies/:genreId" element={<GenreMovies />} />

        {/* --- ΗΘΟΠΟΙΟΙ --- */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />

        {/* --- ΣΚΗΝΟΘΕΤΕΣ --- */}
        <Route path="/directors/:directorId" element={<DirectorMovies />} />

        {/* --- ΧΡΟΝΟΛΟΓΙΑ (ΝΕΟ) --- */}
        {/* Όταν πατάς έτος (π.χ. 2024), ανοίγει το YearMovies */}
        <Route path="/year/:year" element={<YearMovies />} />

      </Routes>

      <Footer />
    </div>
  );
};

export default App;