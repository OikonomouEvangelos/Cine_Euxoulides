// src/App.jsx
import React, { useState } from 'react';
// ΑΦΑΙΡΕΣΑΜΕ το BrowserRouter από εδώ, γιατί υπάρχει ήδη στο main.jsx
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// --- IMPORTS PAGES ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

// --- IMPORTS QUIZ ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';
import QuizHistoryPage from './pages/QuizHistoryPage';

// --- IMPORTS EASTER EGG ---
import BugInvaders from './BugInvaders';

// --- IMPORTS COMPONENTS ---
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import SearchBar from './components/SearchBar';

// --- IMPORTS CATEGORIES ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies';

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
  // επειδή έχουμε βάλει δική μας (custom) μέσα στο αρχείο της σελίδας.
  const shouldHideGlobalSearch =
      location.pathname.startsWith('/movie/') ||   // Σελίδα Ταινίας (Custom toolbar)
      location.pathname.startsWith('/movies') ||   // Σελίδα Κατηγοριών (Custom toolbar)
      location.pathname.startsWith('/category') || // Σελίδα Κατηγοριών (εναλλακτικό)
      location.pathname === '/browse';             // Αρχική Σελίδα (Custom toolbar δίπλα στο Quiz)

  return (
<>
      {/* 1. Easter Egg (Από HugginFace) - Μπαίνει πρώτο για να είναι από πάνω */}
      <BugInvaders />

      {/* 2. Η κυρίως δομή της εφαρμογής */}
      <div className="app-container">
        <Header onMenuToggle={toggleMenu} />
        <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

        {isMenuOpen && <div className="sidemenu-overlay" onClick={closeMenu}></div>}

        {/* --- ΕΛΕΓΧΟΣ ΕΜΦΑΝΙΣΗΣ ΚΕΝΤΡΙΚΗΣ ΜΠΑΡΑΣ (Από main) --- */}
        {/* Εμφανίζεται ΜΟΝΟ αν ΔΕΝ είμαστε σε σελίδα που πρέπει να κρύβεται */}
        {!shouldHideGlobalSearch && (
          <div
            className="global-search-wrapper"
            style={{
              margin: '30px 0',
              display: 'flex',
              justifyContent: 'center', /* Κεντράρισμα */
              padding: '0 20px'
            }}
          >
            {/* Περιορίζουμε το πλάτος για να μην είναι τεράστια */}
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <SearchBar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <Outlet />

        <ScrollToTop />
        <Footer />
      </div>
    </>
  );
};

const App = () => {
  return (
    // Το Router υπάρχει ήδη στο main.jsx, οπότε εδώ βάζουμε μόνο Routes
    <Routes>
{/* 1. PUBLIC ROUTE: Welcome Page (Χωρίς Layout) */}
      <Route path="/" element={<WelcomePage />} />

      {/* 2. PROTECTED ROUTES: Όλες οι εσωτερικές σελίδες */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Αρχική Εφαρμογής */}
        <Route path="/browse" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/movies" element={<MovieCategories />} />
        <Route path="/category/:genreId" element={<GenreMovies />} />
        <Route path="/movies/:genreId" element={<GenreMovies />} />
{/* Ηθοποιοί & Σκηνοθέτες */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />
        <Route path="/directors/:directorId" element={<DirectorMovies />} />
        <Route path="/year/:year" element={<YearMovies />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/quiz" element={<QuizSelectionPage />} />
        <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />
        <Route path="/history" element={<QuizHistoryPage />} />
      </Route>
    </Routes>
  );
};

export default App;