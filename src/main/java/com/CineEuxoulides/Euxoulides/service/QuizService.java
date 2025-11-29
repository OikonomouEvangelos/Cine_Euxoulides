// src/main/java/.../service/QuizService.java

package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.domain.QuizQuestion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class QuizService {

    // Μέθοδος που προσομοιώνει τη φόρτωση ή τη δημιουργία 20 ερωτήσεων
    public List<QuizQuestion> generateQuizQuestions(String difficulty) {

        // --- ΠΡΟΣΟΜΟΙΩΣΗ ΕΡΩΤΗΣΕΩΝ ---
        List<QuizQuestion> questions = new ArrayList<>();

        // Δημιουργία ενός απλού template ερώτησης (20 φορές)
        for (int i = 1; i <= 20; i++) {
            QuizQuestion q = new QuizQuestion();
            q.setId((long) i); // Προσωρινό ID
            q.setQuestionText("Ποιος είναι ο σκηνοθέτης της ταινίας 'Inception'; (Ερώτηση " + i + ")");
            q.setOptions(Arrays.asList("Christopher Nolan", "Steven Spielberg", "Quentin Tarantino", "Martin Scorsese"));
            q.setCorrectAnswerIndex(0); // Christopher Nolan
            q.setDifficulty(difficulty.toUpperCase()); // EASY, MEDIUM, HARD
            q.setMovieId("TMDB_ID_" + i);
            questions.add(q);
        }

        // Ανακατεύουμε τις ερωτήσεις για να φαίνονται τυχαίες
        Collections.shuffle(questions);

        return questions;
    }
}