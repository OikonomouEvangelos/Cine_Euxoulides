// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- IMPORTS PAGES ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage'; // <--- NEW IMPORT

// --- IMPORTS QUIZ ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';
import QuizHistoryPage from './pages/QuizHistoryPage';

// --- IMPORTS COMPONENTS (Layout) ---
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';

// --- IMPORTS CATEGORIES/LISTS ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies';

// --- CSS ---
import './App.css';

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

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* 1. WELCOME PAGE */}
      <Route path="/" element={<WelcomePage />} />

      {/* 2. MAIN APP */}
      <Route element={<AppLayout />}>

        <Route path="/browse" element={<HomePage />} />

        {/* MOVIE DETAILS */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* --- FAVORITES ROUTE --- */}
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* CATEGORIES */}
        <Route path="/movies" element={<MovieCategories />} />
        <Route path="/category/:genreId" element={<GenreMovies />} />
        <Route path="/movies/:genreId" element={<GenreMovies />} />

        {/* ACTORS & DIRECTORS */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />
        <Route path="/directors/:directorId" element={<DirectorMovies />} />

        {/* YEAR */}
        <Route path="/year/:year" element={<YearMovies />} />

        {/* SEARCH */}
        <Route path="/search" element={<SearchResultsPage />} />

        {/* QUIZ SYSTEM */}
        <Route path="/quiz" element={<QuizSelectionPage />} />
        <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />
        <Route path="/history" element={<QuizHistoryPage />} />

      </Route>
    </Routes>
  );
};

export default App;