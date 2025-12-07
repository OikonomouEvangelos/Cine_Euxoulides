package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Repository = "γέφυρα" ανάμεσα στο Java code και τον πίνακα users
public interface UserRepository extends JpaRepository<User, Long> {

    // Βρίσκουμε χρήστη με βάση το email
    Optional<User> findByEmail(String email);
}
