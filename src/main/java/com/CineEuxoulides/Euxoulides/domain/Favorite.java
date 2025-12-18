package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        // FIX 1: Use database column names (with underscores), not Java field names
        @UniqueConstraint(columnNames = {"user_id", "movie_id"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FIX 2: Explicitly map "userId" to the database column "user_id"
    @Column(name = "user_id", nullable = false)
    private String userId;

    // FIX 3: Explicitly map "movieId" to the database column "movie_id"
    // Keeps it as Long to match your plan for BigInt in the DB
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "genre_ids") // Good practice to map this explicitly too if your DB uses snake_case
    private String genreIds;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    // --- Constructors ---

    public Favorite() {
        this.addedAt = LocalDateTime.now();
    }

    public Favorite(String userId, Long movieId, String genreIds) {
        this.userId = userId;
        this.movieId = movieId;
        this.genreIds = genreIds;
        this.addedAt = LocalDateTime.now();
    }

    // --- Getters & Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getGenreIds() { return genreIds; }
    public void setGenreIds(String genreIds) { this.genreIds = genreIds; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}