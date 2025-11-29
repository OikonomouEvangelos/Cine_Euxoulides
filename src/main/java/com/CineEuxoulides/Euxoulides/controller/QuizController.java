// src/main/java/.../controller/QuizController.java

package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.QuizQuestion;
import com.CineEuxoulides.Euxoulides.domain.UserQuizAttempt;
import com.CineEuxoulides.Euxoulides.repository.UserQuizAttemptRepository;
import com.CineEuxoulides.Euxoulides.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    // Inject the Service and Repository
    @Autowired
    private QuizService quizService;

    @Autowired
    private UserQuizAttemptRepository attemptRepository;

    // --- 1. Endpoint για Φόρτωση Ερωτήσεων ---
    // GET /api/quiz/generate?difficulty=EASY
    @GetMapping("/generate")
    public List<QuizQuestion> getQuestions(@RequestParam String difficulty) {
        // Καλούμε τον Service για να φέρει 20 ερωτήσεις με βάση τη δυσκολία
        return quizService.generateQuizQuestions(difficulty);
    }

    // --- 2. Endpoint για Υποβολή Σκορ ---
    // POST /api/quiz/submit
    @PostMapping("/submit")
    public ResponseEntity<UserQuizAttempt> submitScore(@RequestBody UserQuizAttempt attempt) {
        // Placeholder: Στο μέλλον θα πρέπει να υπολογίζετε το σκορ εδώ

        attempt.setDateAttempted(LocalDateTime.now());

        // Placeholder: Εδώ θα βάζατε το πραγματικό user ID από το authentication
        if (attempt.getUserId() == null) {
            attempt.setUserId(99L); // Προσωρινό ID χρήστη
        }

        UserQuizAttempt savedAttempt = attemptRepository.save(attempt);
        return ResponseEntity.ok(savedAttempt);
    }

    // --- 3. Endpoint για Ιστορικό/Leaderboard ---
    // GET /api/quiz/history
    @GetMapping("/history")
    public List<UserQuizAttempt> getLeaderboard() {
        // Επιστρέφουμε όλα τα σκορ, ταξινομημένα από το Repository (Leaderboard)
        return attemptRepository.findAllByOrderByScoreDesc();
    }
}