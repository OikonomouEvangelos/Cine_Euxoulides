// src/App.jsx

import React, { useState } from 'react';
// ΑΦΑΙΡΕΣΑΜΕ το BrowserRouter από εδώ, γιατί υπάρχει ήδη στο main.jsx
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// --- IMPORTS ΣΕΛΙΔΩΝ ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage'; // --- ΝΕΟ IMPORT ---

// --- IMPORTS QUIZ ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';
import QuizHistoryPage from './pages/QuizHistoryPage';

// --- IMPORTS COMPONENTS ---
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SearchBar from './components/SearchBar';

// --- IMPORTS ΚΑΤΗΓΟΡΙΩΝ ---
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

  // Το location χρειάζεται για να ξέρουμε σε ποια σελίδα είμαστε
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // --- ΛΟΓΙΚΗ ΑΠΟΚΡΥΨΗΣ SEARCH BAR ---
  // Ορίζουμε σε ποιες σελίδες ΔΕΝ θέλουμε την κεντρική μπάρα
  const shouldHideGlobalSearch =
      location.pathname.startsWith('/movie/') ||   // Σελίδα Ταινίας
      location.pathname.startsWith('/movies') ||   // Σελίδα Κατηγοριών
      location.pathname.startsWith('/category') || // Σελίδα Κατηγοριών
      location.pathname.startsWith('/favorites') || // Σελίδα Favorites (δεν χρειάζεται search bar)
      location.pathname === '/browse';             // Αρχική Σελίδα

  return (
    <div className="app-container">
      <Header onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {isMenuOpen && <div className="sidemenu-overlay" onClick={closeMenu}></div>}

      {/* --- ΕΛΕΓΧΟΣ ΕΜΦΑΝΙΣΗΣ ΚΕΝΤΡΙΚΗΣ ΜΠΑΡΑΣ --- */}
      {!shouldHideGlobalSearch && (
        <div
          className="global-search-wrapper"
          style={{
            margin: '30px 0',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 20px'
          }}
        >
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <SearchBar />
          </div>
        </div>
      )}

      {/* Εδώ εμφανίζονται οι σελίδες (Outlet) */}
      <Outlet />

      <ScrollToTop />
      <Footer />
    </div>
  );
};


const App = () => {
  return (
    // Το Router υπάρχει ήδη στο main.jsx
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

        {/* --- ΝΕΟ ROUTE FAVORITES --- */}
        <Route path="/favorites" element={<FavoritesPage />} />

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