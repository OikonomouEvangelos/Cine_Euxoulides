// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'; // Προστέθηκε το Outlet

// --- IMPORTS ΣΕΛΙΔΩΝ ---
import WelcomePage from './pages/WelcomePage'; // Η νέα σελίδα εισόδου
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

// --- IMPORTS QUIZ (Από την ομάδα σου) ---
import QuizSelectionPage from './pages/QuizSelectionPage';
import QuizGamePage from './pages/QuizGamePage';
import QuizHistoryPage from './pages/QuizHistoryPage';

// --- IMPORTS COMPONENTS (Layout) ---
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


// --- IMPORTS ΚΑΤΗΓΟΡΙΩΝ/ΛΙΣΤΩΝ (Από την ομάδα σου) ---
import MovieCategories from './components/MovieCategories';
import GenreMovies from './components/GenreMovies';
import ActorMovies from './components/ActorMovies';
import DirectorMovies from './components/DirectorMovies';
import YearMovies from './components/YearMovies';

// --- CSS ---
import './App.css';


// --- LAYOUT COMPONENT ---
// Αυτό το component περιέχει τη λογική του Μενού και το Header/Footer
// Εμφανίζεται ΜΟΝΟ αφού ο χρήστης πατήσει "Είσοδος"
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

      {/* Το Outlet είναι το σημείο που "φορτώνουν" οι σελίδες (Home, Quiz, Movies κλπ) */}
      <Outlet />

      <Footer />
    </div>
  );
};


const App = () => {
  return (
    <Routes>

      {/* 1. Η ΣΕΛΙΔΑ ΚΑΛΩΣΟΡΙΣΜΑΤΟΣ (Χωρίς Header/Footer) */}
      {/* Είναι η πρώτη σελίδα που βλέπει ο χρήστης στο "/" */}
      <Route path="/" element={<WelcomePage />} />


      {/* 2. Η ΚΥΡΙΩΣ ΕΦΑΡΜΟΓΗ (Με Header/Footer) */}
      {/* Όλες οι παρακάτω σελίδες κληρονομούν το Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >


        {/* Η Αρχική σελίδα της εφαρμογής είναι πλέον το /browse */}
        <Route path="/browse" element={<HomePage />} />

        {/* ΛΕΠΤΟΜΕΡΕΙΕΣ ΤΑΙΝΙΑΣ */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* ΚΑΤΗΓΟΡΙΕΣ (Συγχρονισμένο με το SideMenu που φτιάξαμε) */}
        {/* Σημείωση: Στο SideMenu βάλαμε /category/:id, εδώ το προσαρμόζω για να ταιριάζει */}
        <Route path="/movies" element={<MovieCategories />} />
        {/* Αν το SideMenu στέλνει στο /category/:id, άλλαξε το path παρακάτω σε "/category/:genreId" */}
        <Route path="/category/:genreId" element={<GenreMovies />} />
        {/* Κρατάμε και το παλιό για συμβατότητα αν χρειαστεί */}
        <Route path="/movies/:genreId" element={<GenreMovies />} />

        {/* ΗΘΟΠΟΙΟΙ & ΣΚΗΝΟΘΕΤΕΣ */}
        <Route path="/actors/:actorId" element={<ActorMovies />} />
        <Route path="/directors/:directorId" element={<DirectorMovies />} />

        {/* ΧΡΟΝΟΛΟΓΙΑ */}
        <Route path="/year/:year" element={<YearMovies />} />

        {/* ΑΝΑΖΗΤΗΣΗ */}
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