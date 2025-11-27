// src/frontend/src/components/ui/DetailTabs.jsx
import './DetailTabs.css';
import React, { useState } from 'react';
// Θα χρειαστείτε styling στο DetailTabs.css

const DetailTabs = () => {
    const [activeTab, setActiveTab] = useState('cast'); // Cast, Crew, Details

    const tabs = [
        { id: 'cast', label: 'Cast' },
        { id: 'crew', label: 'Crew' },
        { id: 'details', label: 'Details' },
    ];

    return (
        <nav className="detail-tabs-nav">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'tab-btn active' : 'tab-btn'}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default DetailTabs;