package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "movieId"}) // Prevents duplicates
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Long movieId;

    private LocalDateTime addedAt;

    public Favorite() {
        this.addedAt = LocalDateTime.now();
    }

    public Favorite(String userId, Long movieId) {
        this.userId = userId;
        this.movieId = movieId;
        this.addedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public Long getMovieId() { return movieId; }
    public LocalDateTime getAddedAt() { return addedAt; }
}