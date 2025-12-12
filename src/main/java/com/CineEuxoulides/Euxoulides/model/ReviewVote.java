package com.CineEuxoulides.Euxoulides.model;

import jakarta.persistence.*;

@Entity
@Table(name = "review_votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "review_id"})
})
public class ReviewVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    // CHANGED to String
    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private int voteType;

    public ReviewVote() {}

    public ReviewVote(Review review, String userId, int voteType) {
        this.review = review;
        this.userId = userId;
        this.voteType = voteType;
    }

    public Long getId() { return id; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getVoteType() { return voteType; }
    public void setVoteType(int voteType) { this.voteType = voteType; }
}