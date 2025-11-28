import React from 'react';
import ReactDOM from 'react-dom/client';
// ΠΡΟΣΘΗΚΗ: Το component που κάνει δυνατή την πλοήγηση
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Τυλίγουμε την εφαρμογή με το BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);