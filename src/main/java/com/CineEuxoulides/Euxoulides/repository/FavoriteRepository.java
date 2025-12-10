package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Check if a specific movie is favorited (for the Heart button)
    boolean existsByUserIdAndMovieId(String userId, Long movieId);

    // Find the record to delete it
    Optional<Favorite> findByUserIdAndMovieId(String userId, Long movieId);

    // Get list of favorites
    Page<Favorite> findByUserId(String userId, Pageable pageable);
}