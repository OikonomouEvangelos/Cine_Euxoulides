// src/frontend/src/pages/QuizSelectionPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './QuizSelectionPage.css';

const QuizSelectionPage = () => {

    // Δεδομένα για τα 3 επίπεδα δυσκολίας
    const difficulties = [
        { level: 'easy', label: 'Επίπεδο 1: Εύκολο', description: '20 ερωτήσεις | Εισαγωγικές γνώσεις' },
        { level: 'medium', label: 'Επίπεδο 2: Μεσαίο', description: '20 ερωτήσεις | Γνώσεις από Casting/Crew' },
        { level: 'hard', label: 'Επίπεδο 3: Δύσκολο', description: '20 ερωτήσεις | Εξειδικευμένες λεπτομέρειες' },
    ];

    // Placeholder δεδομένα για το ιστορικό (Θα αντικατασταθούν από API)
    const historyData = [
        { id: 1, difficulty: 'hard', score: 18, total: 20, date: '15/11/2025' },
        { id: 2, difficulty: 'medium', score: 12, total: 20, date: '14/11/2025' },
        { id: 3, difficulty: 'easy', score: 19, total: 20, date: '10/11/2025' },
    ];

    return (
        <main className="quiz-selection-container">
            <h1>Επίλεξε Επίπεδο Δυσκολίας</h1>

            {/* 1. Ενότητα Επιλογής Δυσκολίας (Κουτιά) */}
            <section className="difficulty-selection">
                {difficulties.map((d) => (
                    // Ο σύνδεσμος οδηγεί στη σελίδα παιχνιδιού: /quiz/play/easy, /quiz/play/medium, κλπ.
                    <Link key={d.level} to={`/quiz/play/${d.level}`} className="difficulty-card">
                        <h2>{d.label}</h2>
                        <p>{d.description}</p>
                        <button className="btn-start-quiz">Ξεκίνα!</button>
                    </Link>
                ))}
            </section>

            {/* 2. Ενότητα Ιστορικού Προσπαθειών (Ταξινόμηση: Υψηλότερο Σκορ, Φθίνουσα Ημερομηνία) */}
            <section className="history-section">
                <h2>🏆 Ιστορικό Αποτελεσμάτων</h2>
                {historyData.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Επίπεδο</th>
                                <th>Σκορ</th>
                                <th>Ημερομηνία</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Ταξινόμηση: Μόνο για UI, στο μέλλον θα το κάνει το Backend */}
                            {historyData.sort((a, b) => b.score - a.score).map((attempt) => (
                                <tr key={attempt.id}>
                                    <td>{attempt.difficulty.toUpperCase()}</td>
                                    <td>{attempt.score}/{attempt.total}</td>
                                    <td>{attempt.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Δεν υπάρχουν καταγεγραμμένες προσπάθειες ακόμα.</p>
                )}
            </section>
        </main>
    );
};

export default QuizSelectionPage;