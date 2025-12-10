import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange, editable = false }) => {
    const [hover, setHover] = useState(0);

    const handleMouseMove = (e, index) => {
        if (!editable) return;

        const { left, width } = e.target.getBoundingClientRect();
        const percent = (e.clientX - left) / width;

        // If mouse is on left 50%, it's X.5. Else it's X.0
        const isHalf = percent < 0.5;
        const value = isHalf ? index + 0.5 : index + 1;
        setHover(value);
    };

    const handleClick = (e, index) => {
        if (!editable) return;
        const { left, width } = e.target.getBoundingClientRect();
        const percent = (e.clientX - left) / width;
        const isHalf = percent < 0.5;
        const value = isHalf ? index + 0.5 : index + 1;
        onRatingChange(value);
    };

    return (
        <div className="star-rating" style={{ display: 'inline-flex' }}>
            {[...Array(5)].map((_, i) => {
                const fullValue = i + 1;
                const halfValue = i + 0.5;

                // Determine fill state
                // 100% fill
                let fill = '0%';
                let color = '#e4e5e9'; // Grey

                const effectiveRating = hover || rating;

                if (effectiveRating >= fullValue) {
                    fill = '100%';
                    color = '#ffc107'; // Yellow
                } else if (effectiveRating >= halfValue) {
                    fill = '50%';
                    color = '#ffc107';
                }

                return (
                    <span
                        key={i}
                        style={{
                            cursor: editable ? 'pointer' : 'default',
                            fontSize: '24px',
                            marginRight: '2px',
                            position: 'relative',
                            color: '#e4e5e9', // Background color of star
                            display: 'inline-block'
                        }}
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={(e) => handleClick(e, i)}
                    >
                        {/* We render a grey star background, and a yellow star on top clipped */}
                        <span style={{ color: '#e4e5e9' }}>★</span>

                        <span style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: fill,
                            overflow: 'hidden',
                            color: '#ffc107',
                            pointerEvents: 'none' // Let clicks pass through to parent
                        }}>
                            ★
                        </span>
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;