package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.QuizQuestion;
import com.CineEuxoulides.Euxoulides.domain.UserQuizAttempt;
import com.CineEuxoulides.Euxoulides.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*") // Επιτρέπει τη σύνδεση
public class QuizController {

    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuizQuestion>> getQuestions(@RequestParam(defaultValue = "EASY") String difficulty) {
        return ResponseEntity.ok(quizService.generateQuizQuestions(difficulty));
    }

    @PostMapping("/attempt")
    public ResponseEntity<UserQuizAttempt> submitAttempt(@RequestBody UserQuizAttempt attempt) {
        return ResponseEntity.ok(quizService.saveAttempt(attempt));
    }

    @GetMapping("/history")
    public ResponseEntity<List<UserQuizAttempt>> getHistory() {
        return ResponseEntity.ok(quizService.getLeaderboard());
    }
}