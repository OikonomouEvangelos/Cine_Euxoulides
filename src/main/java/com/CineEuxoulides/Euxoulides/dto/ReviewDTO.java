package com.CineEuxoulides.Euxoulides.dto;

import com.CineEuxoulides.Euxoulides.model.Reply;
import com.CineEuxoulides.Euxoulides.model.Review;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewDTO {

    private Long id;
    private String userId;
    private String username;
    private String movieId;
    private Double rating;
    private String comment;
    private boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likeCount;
    private int dislikeCount;
    private int replyCount;
    private List<Reply> replies;

    // NEW FIELD: The logged-in user's vote (0 = none, 1 = like, -1 = dislike)
    private int currentUserVote;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.userId = review.getUserId();
        this.username = review.getUsername();
        this.movieId = review.getMovieId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.isEdited = review.isEdited();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
        this.likeCount = review.getLikeCount();
        this.dislikeCount = review.getDislikeCount();
        this.replyCount = review.getReplyCount();
        this.replies = review.getReplies();
        this.currentUserVote = 0; // Default
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public boolean isEdited() { return isEdited; }
    public void setEdited(boolean isEdited) { this.isEdited = isEdited; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
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

    public int getCurrentUserVote() { return currentUserVote; }
    public void setCurrentUserVote(int currentUserVote) { this.currentUserVote = currentUserVote; }
}