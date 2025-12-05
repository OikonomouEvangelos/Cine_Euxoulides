// src/frontend/src/pages/QuizSelectionPage.jsx

import React, { useState, useEffect } from 'react'; // Χρειάζεται το useState και useEffect
import { Link, useNavigate } from 'react-router-dom';
import './QuizSelectionPage.css';

const QuizSelectionPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- ΛΟΓΙΚΗ ΦΟΡΤΩΣΗΣ ΙΣΤΟΡΙΚΟΥ ---
    useEffect(() => {
        // Το API που φτιάξατε στο QuizController
        fetch('http://localhost:8080/api/quiz/history')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz history (Status: ' + response.status + ')');
                }
                return response.json();
            })
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching history:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // ... (Οι συναρτήσεις startQuiz και difficulties) ...
    const difficulties = [
        { level: 'easy', label: 'Επίπεδο 1: Εύκολο', description: '20 ερωτήσεις | Εισαγωγικές γνώσεις' },
        { level: 'medium', label: 'Επίπεδο 2: Μεσαίο', description: '20 ερωτήσεις | Γνώσεις από Casting/Crew' },
        { level: 'hard', label: 'Επίπεδο 3: Δύσκολο', description: '20 ερωτήσεις | Εξειδικευμένες λεπτομέρειες' },
    ];

    // Συνάρτηση για την έναρξη του Quiz
    const startQuiz = (difficulty) => {
        // Μεταβαίνουμε στη σελίδα παιχνιδιού, στέλνοντας τη δυσκολία
        navigate(`/quiz/play/${difficulty}`);
    };

    return (
        <main className="quiz-selection-container">
            <h1>Επίλεξε Επίπεδο Δυσκολίας</h1>

            {/* 1. Ενότητα Επιλογής Δυσκολίας */}
            <section className="difficulty-selection">
                {difficulties.map((d) => (
                    // ΕΝΗΜΕΡΩΣΗ: Χρησιμοποιούμε απλό div/button για να καλέσουμε το startQuiz
                    <div key={d.level} className="difficulty-card" onClick={() => startQuiz(d.level)}>
                        <h2>{d.label}</h2>
                        <p>{d.description}</p>
                        <button className="btn-start-quiz">Ξεκίνα!</button>
                    </div>
                ))}
            </section>

            {/* 2. Ενότητα Ιστορικού Προσπαθειών (Με Δεδομένα από το API) */}
            <section className="history-section">
                <h2>🏆 Ιστορικό Αποτελεσμάτων</h2>
                {loading && <p>Φόρτωση ιστορικού...</p>}
                {error && <p className="error">Σφάλμα φόρτωσης: {error}</p>}

                {!loading && !error && (
                    <div className="history-table-wrapper">
                        {history.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Επίπεδο</th>
                                        <th>Σκορ</th>
                                        <th>Ημερομηνία</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((attempt, index) => (
                                        <tr key={index}>
                                            <td>{attempt.difficulty.toUpperCase()}</td>
                                            <td>{attempt.score}/{attempt.totalQuestions}</td>
                                            <td>{new Date(attempt.dateAttempted).toLocaleDateString('el-GR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>Δεν υπάρχουν καταγεγραμμένες προσπάθειες ακόμα.</p>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
};

export default QuizSelectionPage;