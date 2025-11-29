// src/main/java/.../repository/UserQuizAttemptRepository.java

package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, Long> {
    // Μέθοδος για το Ιστορικό: Βρίσκει όλες τις προσπάθειες ενός χρήστη, ταξινομημένες ανά σκορ
    List<UserQuizAttempt> findByUserIdOrderByScoreDesc(Long userId);

    // Μέθοδος για να φέρει το ιστορικό όλων των χρηστών (για Leaderboard)
    List<UserQuizAttempt> findAllByOrderByScoreDesc();
}