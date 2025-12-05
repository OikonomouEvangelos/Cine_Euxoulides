package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_quiz_attempt") // Αυτό συνδέει την κλάση με τον πίνακα στη βάση
public class UserQuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id") // Αντιστοιχεί στη στήλη user_id της βάσης
    private Long userId;

    private Integer score;

    @Column(name = "total_questions") // Αντιστοιχεί στη στήλη total_questions
    private Integer totalQuestions;

    private String difficulty; // Easy, Medium, Hard

    @Column(name = "date_attempted") // Αντιστοιχεί στη στήλη date_attempted
    private LocalDateTime dateAttempted;

    // --- Constructors ---

    // Κενός constructor (απαραίτητος για το JPA)
    public UserQuizAttempt() {
        this.dateAttempted = LocalDateTime.now();
    }

    // Constructor για να φτιάχνεις εύκολα νέα αντικείμενα
    public UserQuizAttempt(Long userId, Integer score, Integer totalQuestions, String difficulty) {
        this.userId = userId;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.difficulty = difficulty;
        this.dateAttempted = LocalDateTime.now();
    }

    // --- Getters και Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public LocalDateTime getDateAttempted() {
        return dateAttempted;
    }

    public void setDateAttempted(LocalDateTime dateAttempted) {
        this.dateAttempted = dateAttempted;
    }
}