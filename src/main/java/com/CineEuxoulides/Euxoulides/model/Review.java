package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents the Parent Review entity.
 * Can contain a Rating, a Comment, or both.
 * Acts as the parent for Replies and the target for Votes.
 */
@Entity
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "movieId"}) // Rule: One review per user per movie
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Core Association Data ---
    @Column(nullable = false)
    private String userId; // Link to your Auth system

    @Column(nullable = false)
    private String username; // Stored to display name quickly without extra DB lookups

    @Column(nullable = false)
    private Long movieId; // TMDB Movie ID

    // --- Content ---

    // Nullable: User might comment without rating. Range: 0.0 - 5.0 (Double for half-stars)
    private Double rating;

    // Nullable: User might rate without commenting.
    @Column(columnDefinition = "TEXT")
    private String comment;

    // --- Auditing & State ---

    @Column(nullable = false)
    private boolean isEdited = false; // True if content changed after creation

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // --- "Heat Score" Counters (For fast sorting) ---
    // We update these numbers when a Vote or Reply occurs.
    // Sorting Formula: (likeCount + dislikeCount + replyCount)
    private int likeCount = 0;
    private int dislikeCount = 0;
    private int replyCount = 0;

    // --- Relationships ---

    // CascadeType.ALL + orphanRemoval=true:
    // If this Review is deleted, ALL associated replies are deleted instantly.
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reply> replies = new ArrayList<>();

    // --- Constructors ---

    public Review() {
        // JPA requires empty constructor
    }

    public Review(String userId, String username, Long movieId, Double rating, String comment) {
        this.userId = userId;
        this.username = username;
        this.movieId = movieId;
        this.rating = rating;
        this.comment = comment;
    }

    // --- Lifecycle Hooks (Auto-Timestamps) ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isEdited = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        // Note: The Service layer is responsible for setting isEdited = true
        // only when the comment text specifically changes.
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean edited) { isEdited = edited; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    // No setter for createdAt to prevent accidental changes

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public int getDislikeCount() { return dislikeCount; }
    public void setDislikeCount(int dislikeCount) { this.dislikeCount = dislikeCount; }

    public int getReplyCount() { return replyCount; }
    public void setReplyCount(int replyCount) { this.replyCount = replyCount; }

    public List<Reply> getReplies() { return replies; }
    public void setReplies(List<Reply> replies) { this.replies = replies; }

    // Helper to calculate total interactivity score for the "Smart Feed"
    public int getHeatScore() {
        return likeCount + dislikeCount + replyCount;
    }
}