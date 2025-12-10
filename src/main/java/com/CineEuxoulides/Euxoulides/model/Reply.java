package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a textual reply to a specific Review.
 * Architecture: "One-Level" nesting. You reply to a Review, not to another Reply.
 */
@Entity
@Table(name = "replies")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Relationship ---
    // Links this reply to the Parent Review.
    // FetchType.LAZY is best for performance (don't load the whole review just to see a reply)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Review review;

    // --- Author Data ---
    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String username;

    // --- Content ---
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // --- Auditing & State ---
    @Column(nullable = false)
    private boolean isEdited = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // --- Constructors ---

    public Reply() {
        // JPA requires empty constructor
    }

    public Reply(Review review, String userId, String username, String content) {
        this.review = review;
        this.userId = userId;
        this.username = username;
        this.content = content;
    }

    // --- Lifecycle Hooks ---

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isEdited = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        // Service layer handles setting isEdited = true
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean edited) { isEdited = edited; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}