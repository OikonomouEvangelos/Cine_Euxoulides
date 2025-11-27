// src/App.jsx

import React, { useState } from 'react';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
import './App.css';

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

      <main>
        <h1>Καλώς ήρθατε στο MyFlix!</h1>
        <p>Εδώ θα εμφανίζονται οι λίστες με τις ταινίες και τις σειρές. (Το κείμενο είναι τώρα ανοιχτό γκρι.)</p>

      </main>
      <Footer />
    </div>
  );
};

export default App;