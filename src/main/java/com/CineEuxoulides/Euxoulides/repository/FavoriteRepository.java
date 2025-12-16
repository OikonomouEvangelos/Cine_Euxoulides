package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // ΑΛΛΑΓΗ: Από findByUser(User user) -> σε findByUserId(String userId)
    List<Favorite> findByUserId(String userId);

    Page<Favorite> findByUserId(String userId, Pageable pageable);

    Optional<Favorite> findByUserIdAndMovieId(String userId, Long movieId);
}