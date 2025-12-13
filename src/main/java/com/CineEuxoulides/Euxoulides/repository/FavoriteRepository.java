package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // CHANGED: Arguments are now String
    boolean existsByUserIdAndMovieId(String userId, String movieId);

    Optional<Favorite> findByUserIdAndMovieId(String userId, String movieId);

    Page<Favorite> findByUserId(String userId, Pageable pageable);
}