// src/App.jsx

import React, { useState } from 'react';
// ΠΡΟΣΘΗΚΗ: Εισαγωγή των Routes και Route για τη διαχείριση της πλοήγησης
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';

// ΠΡΟΣΘΗΚΗ: Εισαγωγή του component της νέας σελίδας
import MovieDetailPage from './pages/MovieDetailPage';

import './App.css';


// ΠΡΟΣΘΗΚΗ: Δημιουργούμε ένα placeholder component για την Αρχική σελίδα (Home)
// Αυτό αντικαθιστά το σκέτο <main>
const PlaceholderHomePage = () => (
  <main>
    <h1>Καλώς ήρθατε στο MyFlix!</h1>
    <p>Εδώ θα εμφανίζονται οι λίστες με τις ταινίες και τις σειρές.</p>
    {/* Για δοκιμή του router, μπορείτε να επισκεφθείτε τη διεύθυνση /movie/123 */}
  </main>
);


const App = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">

      <Header onMenuToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {/* Προαιρετικό Overlay - Πρέπει να το διατηρήσουμε αν δεν το διαγράψατε από το CSS */}
      {/* Αν θέλετε να το αφαιρέσετε εντελώς, διαγράψτε την παρακάτω γραμμή */}
      {isMenuOpen && <div className="sidemenu-overlay active" onClick={closeMenu}></div>}

      {/* ΑΛΛΑΓΗ: Χρησιμοποιούμε Routes για να ορίσουμε πού θα εμφανίζεται η κάθε σελίδα */}
      <Routes>
        {/* Διαδρομή για την Αρχική σελίδα (Home - '/') */}
        <Route path="/" element={<PlaceholderHomePage />} />

        {/* Διαδρομή για τη σελίδα λεπτομερειών ταινίας (Movie Detail Page - '/movie/123') */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* Εδώ μπορείτε να προσθέσετε άλλες βασικές διαδρομές αργότερα (π.χ., /actors, /login) */}
      </Routes>

      <Footer />
    </div>
  );
};

export default App;