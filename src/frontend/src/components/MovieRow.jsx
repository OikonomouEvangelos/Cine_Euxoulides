import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MovieRow.css';
import MovieCard from './MovieCard';


const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      // Προσθέτουμε το API KEY στο URL που λαμβάνουμε
      const request = await fetch(`${fetchUrl}&api_key=${API_KEY}&language=el-GR`);
      const data = await request.json();
      setMovies(data.results);
    };
    fetchData();
  }, [fetchUrl, API_KEY]);

  // Κύλιση με τα βελάκια
  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-row">
      <h2>{title}</h2>

      <div className="row-wrapper">
        <button className="handle left-handle" onClick={() => scroll('left')}>‹</button>

        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>


        <button className="handle right-handle" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
};

export default MovieRow;