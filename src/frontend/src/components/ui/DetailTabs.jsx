import React from 'react';
import './DetailTabs.css';

const DetailTabs = ({ activeTab, onTabChange }) => {

    // REMOVED 'Overview' because it will be static text now
    const tabs = [
        { id: 'cast', label: 'Cast' },
        { id: 'details', label: 'Tech Details' },
        // You can add 'reviews' or 'crew' here later
    ];

    return (
        <nav className="detail-tabs-nav">
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