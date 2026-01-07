import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// --- IMPORTS ΣΕΛΙΔΩΝ ---
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import FavoritesWorld from './pages/FavoriteWorld'; // Corrected spelling if file is FavoritesWorld.jsx
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

// --- LAYOUT COMPONENT (Standard Website UI) ---
const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Logic to hide the search bar on specific pages WITHIN the layout
  const shouldHideGlobalSearch =
      location.pathname.startsWith('/movie/') ||
      location.pathname.startsWith('/movies') ||
      location.pathname.startsWith('/category') ||
      location.pathname.startsWith('/favorites') ||
      location.pathname === '/browse' ||
      location.pathname.startsWith('/actors') ||
      location.pathname.startsWith('/directors') ||
      location.pathname.startsWith('/year') ||
      location.pathname.startsWith('/search');

  return (
    <div className="app-container">
      <Header onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {isMenuOpen && <div className="sidemenu-overlay" onClick={closeMenu}></div>}

      {/* --- Global Search Bar --- */}
      {!shouldHideGlobalSearch && (
        <div className="global-search-wrapper">
          <div className="search-row-container" style={{ justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '500px' }}>
              <SearchBar />
            </div>
          </div>
        </div>
      )}

      {/* Render the Page Content */}
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* --- 3. OFFLINE GAME --- */}
      <OfflineGame isOnline={isOnline} />

      <Routes>

        {/* 1. PUBLIC ROUTE */}
        <Route path="/" element={<WelcomePage />} />

        {/* 2. PROTECTED STANDALONE ROUTE (FULL SCREEN 3D) */}
        {/* We place this OUTSIDE AppLayout so it has no Header/Footer/Searchbar */}
        <Route path="/3d-favorites" element={
            <ProtectedRoute>
                <FavoritesWorld />
            </ProtectedRoute>
        } />

        {/* 3. PROTECTED LAYOUT ROUTES (Standard Website) */}
        <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/browse" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* Categories & Filters */}
          <Route path="/movies" element={<MovieCategories />} />
          <Route path="/category/:genreId" element={<GenreMovies />} />
          <Route path="/movies/:genreId" element={<GenreMovies />} />
          <Route path="/actors/:actorId" element={<ActorMovies />} />
          <Route path="/directors/:directorId" element={<DirectorMovies />} />
          <Route path="/year/:year" element={<YearMovies />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Quiz Routes */}
          <Route path="/quiz" element={<QuizSelectionPage />} />
          <Route path="/quiz/play/:difficulty" element={<QuizGamePage />} />
          <Route path="/history" element={<QuizHistoryPage />} />
        </Route>

      </Routes>
    </>
  );
};

export default App;