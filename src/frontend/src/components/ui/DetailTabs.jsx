import React from 'react';
import './DetailTabs.css';

const DetailTabs = ({ activeTab, onTabChange, isFavorite, onToggleFavorite }) => {

    const tabs = [
        { id: 'cast', label: 'Cast' },
        { id: 'details', label: 'Tech Details' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <nav className="detail-tabs-nav">

            {/* HEART BUTTON */}
            <button
                type="button"
                onClick={onToggleFavorite}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '20px',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.1s ease'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {/* SVG Icon ensures exact control over Fill and Outline colors */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "#ef5350" : "none"}
                    stroke={isFavorite ? "#ef5350" : "#9ca3af"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>

            {/* Separator */}
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', marginRight: '20px' }}></div>

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default DetailTabs;