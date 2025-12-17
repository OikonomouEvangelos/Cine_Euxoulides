import React from 'react';

const TrailerModal = ({ videoKey, onClose }) => {
    if (!videoKey) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', /* Dark background */
            zIndex: 10000, /* On top of everything */
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>

            <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: '1000px',
                aspectRatio: '16/9',
                boxShadow: '0 0 50px rgba(0,0,0,1)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: 0,
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '30px',
                        cursor: 'pointer',
                        lineHeight: 1
                    }}
                >
                    &times;
                </button>

                {/* YouTube Embed */}
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: '8px' }}
                ></iframe>
            </div>
        </div>
    );
};

export default TrailerModal;