import React, { useState } from 'react';
import CinematicInvaders from './CinematicInvaders'; // Import the game

const OfflineGame = ({ isOnline }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [finalScore, setFinalScore] = useState(0);

    // Function passed to the game to handle end state
    const handleGameOver = (score) => {
        setFinalScore(score);
        setIsPlaying(false);
    };

    const handlePlayAgain = () => {
        setIsPlaying(true);
        setFinalScore(0);
        // Note: The CinematicInvaders component will automatically re-initialize when re-rendered
    };

    if (isOnline) {
        return null;
    }

    // --- RENDER ---
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            overflow: 'auto'
        }}>
            <h1 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>Offline! 🔌</h1>
            <p style={{ color: '#94a3b8' }}>Shoot the popcorn to pass the time.</p>

            {isPlaying ? (
                // --- GAME IS ACTIVE ---
                <CinematicInvaders 
                    onGameOver={handleGameOver} 
                    onScoreUpdate={setFinalScore} 
                />
            ) : (
                // --- GAME OVER SCREEN ---
                <div style={{
                    padding: '40px',
                    backgroundColor: '#1e2328',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    width: '90%',
                    maxWidth: '500px',
                    textAlign: 'center',
                    margin: '20px auto',
                    border: '2px solid #ef5350' // Game over red accent
                }}>
                    <h2 style={{ color: '#ef5350', fontSize: '2.5rem' }}>GAME OVER</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                        Final Score: <span style={{ color: '#00e054', fontWeight: 'bold' }}>{finalScore}</span>
                    </p>
                    <button 
                        onClick={handlePlayAgain}
                        style={{ 
                            padding: '12px 25px', 
                            backgroundColor: '#2563eb', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}
                    >
                        Play Again
                    </button>
                </div>
            )}
            
            <p style={{ marginTop: '20px', color: '#94a3b8' }}>
                Refresh the page or check your connection to resume browsing.
            </p>
        </div>
    );
};

export default OfflineGame;