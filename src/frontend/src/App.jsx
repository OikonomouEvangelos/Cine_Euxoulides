// src/App.jsx

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (

    <div className="app-container">
      <Header />


      <main>
        <h1>Καλώς ήρθατε στο MyFlix!</h1>
        <p>Εδώ θα εμφανίζονται οι λίστες με τις ταινίες και τις σειρές. (Το κείμενο είναι τώρα ανοιχτό γκρι.)</p>
      </main>
      <Footer />
    </div>
  );
};

export default App;