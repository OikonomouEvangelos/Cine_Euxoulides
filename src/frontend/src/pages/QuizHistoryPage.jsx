import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizGamePage.css'; // Χρησιμοποιούμε το ίδιο CSS για ευκολία

const QuizHistoryPage = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/quiz/history')
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="quiz-container" style={{ paddingTop: '50px' }}>
            <h1 style={{ color: 'white', marginBottom: '20px' }}>Πίνακας Κατάταξης</h1>

            <div className="quiz-box" style={{ maxWidth: '800px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #444' }}>
                            <th style={{ padding: '10px' }}>Ημερομηνία</th>
                            <th style={{ padding: '10px' }}>Δυσκολία</th>
                            <th style={{ padding: '10px' }}>Σκορ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((attempt, index) => (
                            <tr key={attempt.id || index} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '10px' }}>
                                    {new Date(attempt.dateAttempted).toLocaleString()}
                                </td>
                                <td style={{ padding: '10px' }}>{attempt.difficulty}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#f3ce13' }}>
                                    {attempt.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    className="retry-btn"
                    style={{ marginTop: '20px' }}
                    onClick={() => navigate('/quiz-selection')} // Ή όπου αλλού θες να πηγαίνει πίσω
                >
                    Πίσω
                </button>
            </div>
        </div>
    );
};

export default QuizHistoryPage;