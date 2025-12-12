package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "movieId"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CHANGED: Long -> String to match Database VARCHAR
    @Column(nullable = false)
    private String userId;

    // CHANGED: Long -> String to match Database VARCHAR
    @Column(nullable = false)
    private String movieId;

    private LocalDateTime addedAt;

    public Favorite() {
        this.addedAt = LocalDateTime.now();
    }

    public Favorite(String userId, String movieId) {
        this.userId = userId;
        this.movieId = movieId;
        this.addedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public String getMovieId() { return movieId; }
    public LocalDateTime getAddedAt() { return addedAt; }
}