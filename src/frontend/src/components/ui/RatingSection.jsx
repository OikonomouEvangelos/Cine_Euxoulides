// src/frontend/src/components/ui/RatingSection.jsx

import React from 'react';
// Θα χρειαστείτε CSS styling για τα αστέρια στο RatingSection.css

const RatingSection = () => {
    // Placeholder για 5 αστέρια. Στο μέλλον θα χρειαστεί state για το rating
    const stars = [1, 2, 3, 4, 5];

    return (
        <section className="rating-section">
            <h4>Βαθμολογήστε την ταινία</h4>
            <div className="stars-container">
                {stars.map((star) => (
                    <span
                        key={star}
                        className="star-icon"
                        // Placeholder event - θα χρησιμοποιηθεί αργότερα με το backend
                        onClick={() => console.log(`Βαθμολογήθηκε με ${star} αστέρια`)}
                    >
                        ★
                    </span>
                ))}
            </div>
        </section>
    );
};

export default RatingSection;