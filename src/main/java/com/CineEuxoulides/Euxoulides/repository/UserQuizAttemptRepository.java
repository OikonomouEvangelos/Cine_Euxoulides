package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.UserQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserQuizAttemptRepository extends JpaRepository<UserQuizAttempt, Long> {

    // ΠΡΟΣΟΧΗ: Το όνομα πρέπει να είναι ΑΚΡΙΒΩΣ έτσι για να ταιριάζει με το Service
    List<UserQuizAttempt> findAllByOrderByScoreDesc();
}