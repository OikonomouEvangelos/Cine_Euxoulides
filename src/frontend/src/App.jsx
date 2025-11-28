// src/App.jsx

import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';


import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';

import './App.css';


const App = () => {

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


      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/movie/:id" element={<MovieDetailPage />} />

      </Routes>

      <Footer />
    </div>
  );
};

export default App;