package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        // Αυτό εξασφαλίζει ότι ο ίδιος χρήστης δεν θα έχει την ίδια ταινία 2 φορές
        @UniqueConstraint(columnNames = {"userId", "movieId"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Long movieId; // Το κρατάμε Long (αριθμό) για να ταιριάζει με τη νέα βάση

    // Απαραίτητο για το Blend
    private String genreIds;

    private LocalDateTime addedAt;

    // Κενός κατασκευαστής (Υποχρεωτικός)
    public Favorite() {
        this.addedAt = LocalDateTime.now();
    }

    // Ο κατασκευαστής που χρησιμοποιούμε
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