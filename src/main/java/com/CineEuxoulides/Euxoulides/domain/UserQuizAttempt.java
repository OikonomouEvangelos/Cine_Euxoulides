// src/main/java/.../domain/UserQuizAttempt.java

package com.CineEuxoulides.Euxoulides.domain; // Ελέγξτε και αλλάξτε το package

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;              // Περιλαμβάνει Getter και Setter
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Data // <-- Αυτό καλύπτει τα Getter/Setter/ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_quiz_attempt")
public class UserQuizAttempt {

    // Πρωτεύον Κλειδί (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Placeholder για τον χρήστη (Υποθέτουμε ότι το user ID είναι Long)
    private Long userId;

    // Το επίπεδο δυσκολίας (EASY, MEDIUM, HARD)
    private String difficulty;

    // Το σκορ που πέτυχε ο χρήστης
    private int score;

    // Οι συνολικές ερωτήσεις (π.χ., 20)
    private int totalQuestions;

    // Ημερομηνία και ώρα της προσπάθειας
    private LocalDateTime dateAttempted;
}