// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// --- IMPORTS ΣΕΛΙΔΩΝ ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';

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
import OfflineGame from './components/OfflineGame';

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
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // --- ΛΟΓΙΚΗ ΑΠΟΚΡΥΨΗΣ SEARCH BAR ---
  // Εδώ ορίζουμε πού ΔΕΝ θέλουμε να φαίνεται η κεντρική μπάρα
  const shouldHideGlobalSearch =
      location.pathname.startsWith('/movie/') ||
      location.pathname.startsWith('/movies') ||
      location.pathname.startsWith('/category') ||
      location.pathname.startsWith('/favorites') ||
      location.pathname === '/browse' ||
      // Νέες προσθήκες για να φύγει η μπάρα από τις σελίδες που έφτιαξες:
      location.pathname.startsWith('/actors') ||
      location.pathname.startsWith('/directors') ||
      location.pathname.startsWith('/year') ||
      location.pathname.startsWith('/search');

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
  // --- 1. STATE: Track Online Status ---
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 2. EVENT LISTENERS: Update state when connection status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  return (
    <>
      {/* --- 3. OFFLINE GAME --- */}
      {/* Καλύπτει την οθόνη όταν δεν υπάρχει ίντερνετ */}
      <OfflineGame isOnline={isOnline} />

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
          {/* Όλα τα routes της εφαρμογής */}
          <Route path="/browse" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movies" element={<MovieCategories />} />
          <Route path="/category/:genreId" element={<GenreMovies />} />
          <Route path="/movies/:genreId" element={<GenreMovies />} />
          <Route path="/actors/:actorId" element={<ActorMovies />} />
          <Route path="/directors/:directorId" element={<DirectorMovies />} />
          <Route path="/year/:year" element={<YearMovies />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/quiz" element={<QuizSelectionPage />} />
          <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />
          <Route path="/history" element={<QuizHistoryPage />} />

        </Route>

      </Routes>
    </>
  );
};

export default App;