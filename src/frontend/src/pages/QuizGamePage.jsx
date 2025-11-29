// src/frontend/src/pages/QuizGamePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './QuizGamePage.css';

// Placeholder για τη δομή μιας ερώτησης (όπως επιστρέφει το Java Backend)
const initialQuestions = [
    // Αυτά θα αντικατασταθούν από τα δεδομένα του API
    { id: 1, questionText: "Ποιος είναι ο σκηνοθέτης του Pulp Fiction;", options: ["Tarantino", "Nolan", "Spielberg", "Scott"], correctAnswerIndex: 0 }
];

const QuizGamePage = () => {
    // Παίρνουμε το επίπεδο δυσκολίας από το URL
    const { difficulty } = useParams();

    // Καταστάσεις (States) για τη διαχείριση του παιχνιδιού
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizState, setQuizState] = useState('loading'); // 'loading', 'active', 'finished'
    const [selectedAnswer, setSelectedAnswer] = useState(null); // Η επιλογή του χρήστη

    // --- ΛΟΓΙΚΗ ΦΟΡΤΩΣΗΣ ΕΡΩΤΗΣΕΩΝ (useEffect) ---
    useEffect(() => {
        setQuizState('loading');
        // Στο μέλλον, εδώ θα καλείται το GET /api/quiz/generate?difficulty=X

        // --- ΠΡΟΣΟΜΟΙΩΣΗ ΦΟΡΤΩΣΗΣ API ---
        setTimeout(() => {
            setQuestions(initialQuestions); // Χρησιμοποιούμε τα placeholder
            setQuizState('active');
        }, 1500);
        // ---------------------------------

    }, [difficulty]); // Εκτελείται όταν αλλάζει η δυσκολία (π.χ. στην αρχή)


    // --- ΛΟΓΙΚΗ ΥΠΟΒΟΛΗΣ ΑΠΑΝΤΗΣΗΣ ---
    const handleAnswerSubmit = () => {
        if (selectedAnswer === null) return; // Ο χρήστης πρέπει να επιλέξει απάντηση

        // Έλεγχος απάντησης (Αυτός ο έλεγχος πρέπει να γίνει ασφαλής στο Backend στο μέλλον)
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedAnswer === currentQuestion.correctAnswerIndex) {
            setScore(prevScore => prevScore + 1);
        }

        // Προχώρησε στην επόμενη ερώτηση
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setSelectedAnswer(null); // Επαναφορά επιλογής
        } else {
            // Τέλος του Quiz - Εδώ θα καλούσατε το POST /api/quiz/submit
            setQuizState('finished');
        }
    };

    // --- ΠΕΡΙΕΧΟΜΕΝΟ ΑΝΑ ΚΑΤΑΣΤΑΣΗ ---

    // 1. Loading
    if (quizState === 'loading') {
        return <main className="quiz-game-container"><h2>Φόρτωση ερωτήσεων...</h2></main>;
    }

    // 2. Finished
    if (quizState === 'finished') {
        return (
            <main className="quiz-game-container final-screen">
                <h2>Ολοκληρώθηκε το Quiz!</h2>
                <h3>Το σκορ σου: {score} / {questions.length}</h3>
                <p>Μπράβο! Τώρα μπορείς να δεις το σκορ σου στον πίνακα κατάταξης.</p>
                {/* Σύνδεσμος για το ιστορικό */}
                <button className="btn-main" onClick={() => console.log('Πλοήγηση στο Ιστορικό')}>
                    Δες το Ιστορικό
                </button>
            </main>
        );
    }

    // 3. Active (Παιχνίδι σε εξέλιξη)
    const currentQuestion = questions[currentQuestionIndex];
    const progress = `${currentQuestionIndex + 1} / ${questions.length}`;

    return (
        <main className="quiz-game-container">
            <h3>Επίπεδο: {difficulty.toUpperCase()}</h3>
            <div className="quiz-progress">{progress}</div>

            <div className="question-card">
                <p className="question-text">{currentQuestion.questionText}</p>

                <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                            onClick={() => setSelectedAnswer(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    className="btn-submit"
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Επόμενη Ερώτηση' : 'Τέλος Quiz'}
                </button>
            </div>
        </main>
    );
};

export default QuizGamePage;