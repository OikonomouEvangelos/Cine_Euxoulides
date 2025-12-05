// src/main/java/.../repository/QuizQuestionRepository.java

package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    // Μέθοδος για να φέρνει όλες τις ερωτήσεις μιας συγκεκριμένης δυσκολίας
    List<QuizQuestion> findByDifficulty(String difficulty);
}