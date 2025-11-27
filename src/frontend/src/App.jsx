// src/App.jsx

import React from 'react';
import Header from './components/Header';
import './App.css'; // <--- ΝΕΑ ΠΡΟΣΘΗΚΗ: Κάνουμε import το App.css

const App = () => {
  return (
    // Προσθέτουμε την κλάση app-container στο κύριο div
    <div className="app-container">
      <Header />

      {/* Η περιοχή main χρησιμοποιεί το flex-grow: 1 από το App.css */}
      <main>
        <h1>Καλώς ήρθατε στο MyFlix!</h1>
        <p>Εδώ θα εμφανίζονται οι λίστες με τις ταινίες και τις σειρές. (Το κείμενο είναι τώρα ανοιχτό γκρι.)</p>
        {/* Εδώ θα μπουν τα components για τις λίστες (π.χ. MovieList) */}
      </main>

    </div>
  );
};

export default App;