package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // CHANGED inputs to String
    Optional<Review> findByUserIdAndMovieId(String userId, String movieId);

    @Query("SELECT r FROM Review r WHERE r.movieId = :movieId AND r.userId <> :currentUserId ORDER BY (r.likeCount + r.dislikeCount + r.replyCount) DESC")
    Page<Review> findByMovieIdAndUserIdNot(@Param("movieId") String movieId, @Param("currentUserId") String currentUserId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.movieId = :movieId ORDER BY (r.likeCount + r.dislikeCount + r.replyCount) DESC")
    Page<Review> findByMovieId(@Param("movieId") String movieId, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movieId = :movieId AND r.rating IS NOT NULL")
    Double getAverageRating(@Param("movieId") String movieId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.movieId = :movieId AND r.rating IS NOT NULL")
    Long countRatings(@Param("movieId") String movieId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.movieId = :movieId AND r.comment IS NOT NULL")
    Long countComments(@Param("movieId") String movieId);
}