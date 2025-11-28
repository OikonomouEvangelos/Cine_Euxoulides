import React from 'react';
import SearchBar from '../components/SearchBar'; // <-- Χρειάζεται να εισαχθεί
import TrendingSection from '../components/TrendingSection'; // <-- Χρειάζεται να εισαχθεί

const HomePage = () => {
  return (
    // Το main τώρα είναι εδώ
    <main>
      <SearchBar />
      <TrendingSection title="Τάσεις Τώρα" />
      {/* Μόνο το περιεχόμενο που αλλάζει ανά σελίδα */}
    </main>
  );
};

export default HomePage;