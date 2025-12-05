import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizGamePage.css'; // <--- ΣΗΜΑΝΤΙΚΟ: Βάλε το αρχείο CSS στον ίδιο φάκελο με αυτό το αρχείο

const QuizGamePage = () => {
    // 1. Διόρθωση: Παίρνουμε τη δυσκολία από το URL με useParams (επειδή στο App.jsx είναι :difficulty)
    const { difficulty } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);

    // 2. Φόρτωση ερωτήσεων από το Backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Διόρθωση URL: Το endpoint είναι /api/quiz/questions
                const response = await axios.get(`http://localhost:8080/api/quiz/questions?difficulty=${difficulty}`);
                setQuestions(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setLoading(false);
            }
        };

        if (difficulty) {
            fetchQuestions();
        }
    }, [difficulty]);

    // 3. Όταν ο χρήστης επιλέγει απάντηση
    const handleAnswerClick = (selectedIndex) => {
        const currentQuestion = questions[currentQuestionIndex];
        let newScore = score;

        // Έλεγχος αν είναι σωστό
        if (selectedIndex === currentQuestion.correctAnswerIndex) {
            newScore = score + 1;
            setScore(newScore);
        }

        // Πάμε στην επόμενη ερώτηση
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            // Αν τελείωσαν οι ερωτήσεις, στέλνουμε το ΤΕΛΙΚΟ σκορ
            finishGame(newScore);
        }
    };

    // 4. Υποβολή σκορ στο Backend
    const finishGame = async (finalScore) => {
        setGameFinished(true);

        const attemptData = {
            score: finalScore,
            totalQuestions: questions.length, // Προσθήκη πεδίου που απαιτεί η βάση
            difficulty: difficulty,
            userId: 1 // Προσωρινό ID (Guest)
        };

        try {
            // Διόρθωση URL: Το endpoint είναι /api/quiz/attempt
            await axios.post('http://localhost:8080/api/quiz/attempt', attemptData);
            console.log("Score saved successfully!");
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    if (loading) return <div className="quiz-container"><h2>Φόρτωση ερωτήσεων...</h2></div>;

    if (questions.length === 0) return <div className="quiz-container"><h2>Δεν βρέθηκαν ερωτήσεις!</h2></div>;

    // --- ΟΘΟΝΗ ΤΕΛΟΥΣ (GAME OVER) ---
    if (gameFinished) {
        return (
            <div className="quiz-container">
                <div className="quiz-box results-box" style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Ολοκληρώθηκε το Quiz!</h2>
                    <h1 style={{ color: '#ffd700', fontSize: '3rem' }}>{score} / {questions.length}</h1>
                    <p>Η προσπάθειά σου καταχωρήθηκε.</p>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            className="option-btn"
                            style={{ backgroundColor: '#2196F3' }}
                            onClick={() => navigate('/history')}
                        >
                            Δες το Ιστορικό
                        </button>

                        <button
                            className="option-btn"
                            style={{ backgroundColor: '#4CAF50' }}
                            onClick={() => window.location.reload()}
                        >
                            Παίξε ξανά
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- ΟΘΟΝΗ ΠΑΙΧΝΙΔΙΟΥ ---
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <span>Επίπεδο: {difficulty}</span>
                <span>Ερώτηση {currentQuestionIndex + 1} / {questions.length}</span>
            </div>

            <div className="quiz-box">
                <h3 className="question-text">{currentQuestion.questionText}</h3>

                <div className="options-grid">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className="option-btn"
                            onClick={() => handleAnswerClick(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizGamePage;