import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './MoodScanner.css';

const MoodScanner = ({ onClose }) => {
    const webcamRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate(); // 2. Initialize navigation hook

    const JAVA_BACKEND_URL = "http://localhost:8080/api/movies/analyze-mood";

    const captureAndScan = async () => {
        setStatus('scanning');
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            setStatus('error');
            return;
        }

        try {
            const blob = await fetch(imageSrc).then(res => res.blob());
            const formData = new FormData();
            formData.append("image", blob, "scan.jpg");

            const response = await axios.post(JAVA_BACKEND_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMovies(response.data.results || []);
            setStatus('success');
        } catch (error) {
            console.error("Scan Error:", error);
            setStatus('error');
        }
    };

    // 3. New function to handle navigation
    const handleMovieClick = (movieId) => {
        // Close the scanner window first
        onClose();
        // Navigate to the movie details page (adjust path if your route is different)
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="scanner-backdrop" onClick={onClose}>
            {/* The Main Window */}
            <div className="scanner-window" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="scanner-header">
                    <h3 className="scanner-title">
                        {status === 'success' ? 'Recommended Movies' : 'Mood Scanner'}
                    </h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* Scrollable Content Area */}
                <div className="scanner-content-scroll">

                    {/* CAMERA VIEW */}
                    {status !== 'success' && (
                        <>
                            <div className="camera-container">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="webcam-view"
                                    videoConstraints={{ facingMode: "user" }}
                                />
                            </div>

                            {status === 'error' && (
                                <p style={{color: '#ff4444', textAlign: 'center', fontSize: '0.9rem'}}>
                                    Unable to capture. Please allow camera access.
                                </p>
                            )}

                            <button
                                className="primary-btn"
                                onClick={captureAndScan}
                                disabled={status === 'scanning'}
                            >
                                {status === 'scanning' ? 'Analyzing...' : 'Scan Mood'}
                            </button>
                        </>
                    )}

                    {/* RESULTS VIEW */}
                    {status === 'success' && (
                        <>
                            <div className="results-grid">
                                {movies.slice(0, 9).map((movie) => (
                                    <div
                                        key={movie.id}
                                        className="result-card"
                                        // 4. Attach click handler here
                                        onClick={() => handleMovieClick(movie.id)}
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="result-poster"
                                        />
                                        <p className="result-title">{movie.title}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '25px', textAlign: 'center' }}>
                                <button
                                    className="secondary-btn"
                                    onClick={() => setStatus('idle')}
                                >
                                    ↺ Scan Again
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MoodScanner;