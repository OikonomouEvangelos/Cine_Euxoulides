package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;

/**
 * Represents a user's reaction (Like/Dislike) to a Review.
 * Uses a UniqueConstraint to ensure a user can only vote once per review.
 */
@Entity
@Table(name = "review_votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "review_id"})
})
public class ReviewVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Relationship ---
    // Links to the Review being liked/disliked.
    // If the Review is deleted, the Vote records should eventually be cleaned up (handled by DB Foreign Key).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    // --- Core Data ---
    @Column(nullable = false)
    private String userId;

    /**
     * Stores the type of vote:
     * 1  = Like
     * -1  = Dislike
     * 0  = Neutral (though usually we just delete the row for neutral)
     */
    @Column(nullable = false)
    private int voteType;

    // --- Constructors ---

    public ReviewVote() {
    }

    public ReviewVote(Review review, String userId, int voteType) {
        this.review = review;
        this.userId = userId;
        this.voteType = voteType;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getVoteType() { return voteType; }
    public void setVoteType(int voteType) { this.voteType = voteType; }
}