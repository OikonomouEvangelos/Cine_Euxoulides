// src/main/java/.../domain/QuizQuestion.java

package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "quiz_question") // Ορίζουμε το όνομα του πίνακα στη βάση
public class QuizQuestion {

    // Πρωτεύον Κλειδί (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Αυτόματη αύξηση ID
    private Long id;

    // Το κείμενο της ερώτησης
    private String questionText;

    // Οι επιλογές απάντησης: Αποθηκεύονται ως ξεχωριστή λίστα συνδεδεμένη με την ερώτηση
    @ElementCollection
    private List<String> options;

    // Ο δείκτης της σωστής απάντησης (π.χ., 0, 1, 2, 3)
    private int correctAnswerIndex;

    // Επίπεδο δυσκολίας: EASY, MEDIUM, HARD
    private String difficulty;

    // Το TMDB ID της ταινίας (για να ξέρουμε από πού προήλθε η ερώτηση)
    private String movieId;
}