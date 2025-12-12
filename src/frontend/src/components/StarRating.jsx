import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange, editable = false }) => {
    const [hover, setHover] = useState(0);

    const handleMouseMove = (e, index) => {
        if (!editable) return;

        const { left, width } = e.target.getBoundingClientRect();
        const percent = (e.clientX - left) / width;
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

                let fill = '0%';
                const effectiveRating = hover || rating;

                if (effectiveRating >= fullValue) {
                    fill = '100%';
                } else if (effectiveRating >= halfValue) {
                    fill = '50%';
                }

                return (
                    <span
                        key={i}
                        style={{
                            cursor: editable ? 'pointer' : 'default',
                            fontSize: '34px',
                            marginRight: '4px',
                            position: 'relative',
                            color: '#4a5568',
                            display: 'inline-block'
                        }}
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        onMouseLeave={() => setHover(0)}
                        onClick={(e) => handleClick(e, i)}
                    >
                        <span style={{ color: '#4a5568' }}>★</span>
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: fill,
                            overflow: 'hidden',
                            color: '#ffc107',
                            pointerEvents: 'none'
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