// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute:
 * - Κοιτάει αν υπάρχει token στο localStorage
 * - Αν ΔΕΝ υπάρχει -> σε γυρίζει στο "/"
 * - Αν ΥΠΑΡΧΕΙ -> αφήνει να δεις τα children (HomePage, Quiz, Movies κτλ)
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Αν δεν υπάρχει token, γύρνα στο WelcomePage (login/εγγραφή)
    return <Navigate to="/" replace />;
  }

  // Αν υπάρχει token, δείξε κανονικά το περιεχόμενο
  return children;
};

export default ProtectedRoute;
