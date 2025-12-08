// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- IMPORTS ΣΕΛΙΔΩΝ ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

// --- IMPORTS QUIZ ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';
import QuizHistoryPage from './pages/QuizHistoryPage';

// --- IMPORTS COMPONENTS (Διορθωμένα Paths: απευθείας στο components/) ---
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// --- IMPORTS ΚΑΤΗΓΟΡΙΩΝ (Διορθωμένα Paths: απευθείας στο components/) ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies';

// --- CSS ---
import './App.css';

// --- LAYOUT COMPONENT ---
const AppLayout = () => {
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

      <Outlet />
      <ScrollToTop />
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTE: Welcome Page */}
      <Route path="/" element={<WelcomePage />} />

      {/* 2. PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Αρχική Εφαρμογής */}
        <Route path="/browse" element={<HomePage />} />

        {/* Λεπτομέρειες Ταινίας */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* Κατηγορίες */}
        <Route path="/movies" element={<MovieCategories />} />
        <Route path="/category/:genreId" element={<GenreMovies />} />
        <Route path="/movies/:genreId" element={<GenreMovies />} />

        {/* Ηθοποιοί & Σκηνοθέτες */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />
        <Route path="/directors/:directorId" element={<DirectorMovies />} />

        {/* Χρονιά */}
        <Route path="/year/:year" element={<YearMovies />} />

        {/* Αναζήτηση */}
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Quiz Section */}
        <Route path="/quiz" element={<QuizSelectionPage />} />
        <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />
        <Route path="/history" element={<QuizHistoryPage />} />

      </Route>
    </Routes>
  );
};

export default App;