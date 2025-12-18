package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Valid: Returns a list of favorites for one user
    List<Favorite> findByUserId(String userId);

    // Valid: Returns a specific page of favorites for one user
    Page<Favorite> findByUserId(String userId, Pageable pageable);

    // FIX THIS LINE: You need both userId AND movieId arguments
    Optional<Favorite> findByUserIdAndMovieId(String userId, Long movieId);
}