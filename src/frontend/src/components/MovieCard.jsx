// src/components/MovieCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';


const MovieCard = ({ movie }) => {
  if (!movie) return null;

  const {
    id,
    title,
    poster_path,
    vote_average,
  } = movie;


  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w342${poster_path}`
    : 'https://via.placeholder.com/342x513';

  return (
    <Link to={`/movie/${id}`} className="movie-card-link">
      <div className="movie-card">
        <img
          src={imageUrl}
          alt={title}
          className="movie-poster"
        />

        <div className="movie-info">
          <h3 title={title}>{title}</h3>

          <p className="movie-rating">
            ⭐ {vote_average?.toFixed(1)}
            </p>

        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
