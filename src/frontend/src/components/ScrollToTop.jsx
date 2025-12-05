// src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import './ScrollToTop.css'; // Θα φτιάξουμε το CSS στο επόμενο βήμα

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Ελέγχει αν έχουμε κατέβει αρκετά για να εμφανιστεί το κουμπί
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Η λειτουργία που μας πάει πάνω
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Ομαλή κύλιση
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Καθαρισμός του event όταν φεύγουμε από τη σελίδα
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-btn">
          ↑
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;