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

    // 1. Find a specific review (used to check if user already rated/commented so we can update it)
    Optional<Review> findByUserIdAndMovieId(String userId, Long movieId);

    // 2. Main Feed (Logged In): Get reviews for a movie EXCLUDING the current user.
    // Sorted by "Heat Score" (Likes + Dislikes + Replies) Descending.
    // Logic: User's own review is fetched separately to sit at the top.
    @Query("SELECT r FROM Review r WHERE r.movieId = :movieId AND r.userId <> :currentUserId ORDER BY (r.likeCount + r.dislikeCount + r.replyCount) DESC")
    Page<Review> findByMovieIdAndUserIdNot(@Param("movieId") Long movieId, @Param("currentUserId") String currentUserId, Pageable pageable);

    // 3. Public Feed (Not Logged In): Get all reviews sorted by Heat Score.
    @Query("SELECT r FROM Review r WHERE r.movieId = :movieId ORDER BY (r.likeCount + r.dislikeCount + r.replyCount) DESC")
    Page<Review> findByMovieId(@Param("movieId") Long movieId, Pageable pageable);

    // 4. Hover Box: Get Average Rating
    // We strictly ignore rows where rating is NULL (comments only).
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movieId = :movieId AND r.rating IS NOT NULL")
    Double getAverageRating(@Param("movieId") Long movieId);

    // 5. Hover Box: Count Ratings (Heart Count)
    // Counts only rows that have a star rating.
    @Query("SELECT COUNT(r) FROM Review r WHERE r.movieId = :movieId AND r.rating IS NOT NULL")
    Long countRatings(@Param("movieId") Long movieId);

    // 6. Header: Count Total Comments
    // Counts only rows that have text content.
    @Query("SELECT COUNT(r) FROM Review r WHERE r.movieId = :movieId AND r.comment IS NOT NULL")
    Long countComments(@Param("movieId") Long movieId);
}