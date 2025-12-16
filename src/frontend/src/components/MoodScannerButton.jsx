import React from 'react';

const MoodScannerButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      // REMOVED className="quiz-landing-spot" to prevent positioning conflicts
      title="Find Movies by Mood"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        fontFamily: 'inherit',
        position: 'relative' // Ensures it stays in flow
      }}
    >
      {/* The Animation Structure */}
      <div className="quiz-content">
          <div className="quiz-icon-container">
              <div className="quiz-icon">
                  <span role="img" aria-label="Mood Scan">📸</span>
              </div>
              <div className="quiz-ring"></div>
          </div>
      </div>

      {/* The Text Label */}
      <span style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#e5e5e5',
          textShadow: '0 2px 4px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap'
      }}>
        Mood Scan
      </span>
    </button>
  );
};

export default MoodScannerButton;