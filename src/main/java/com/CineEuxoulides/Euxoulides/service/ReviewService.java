package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.model.Reply;
import com.CineEuxoulides.Euxoulides.model.Review;
import com.CineEuxoulides.Euxoulides.model.ReviewVote;
import com.CineEuxoulides.Euxoulides.repository.ReplyRepository;
import com.CineEuxoulides.Euxoulides.repository.ReviewRepository;
import com.CineEuxoulides.Euxoulides.repository.ReviewVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewVoteRepository reviewVoteRepository;

    @Autowired
    private ReplyRepository replyRepository;

    // --- 1. Add or Update Review (The "Upsert" Logic) ---
    @Transactional
    public Review saveOrUpdateReview(String userId, String username, Long movieId, Double rating, String comment) {
        // Check if this user already reviewed this movie
        Optional<Review> existing = reviewRepository.findByUserIdAndMovieId(userId, movieId);

        if (existing.isPresent()) {
            Review review = existing.get();
            // Update fields
            if (rating != null) review.setRating(rating);

            // Logic: Mark as edited only if the comment text actually changes
            if (comment != null && !comment.equals(review.getComment())) {
                review.setComment(comment);
                review.setEdited(true);
            } else if (comment != null) {
                // If comment is same, just ensure it's set (in case it was null before)
                review.setComment(comment);
            }

            // Always update timestamp
            review.setUpdatedAt(LocalDateTime.now());
            return reviewRepository.save(review);
        } else {
            // Create new Review
            Review newReview = new Review(userId, username, movieId, rating, comment);
            return reviewRepository.save(newReview);
        }
    }

    // --- 2. Vote on a Review (Like/Dislike) ---
    @Transactional
    public void voteOnReview(String userId, Long reviewId, int voteType) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // RULE: Block Self-Like
        if (review.getUserId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own review.");
        }

        Optional<ReviewVote> existingVote = reviewVoteRepository.findByUserIdAndReviewId(userId, reviewId);

        if (existingVote.isPresent()) {
            ReviewVote vote = existingVote.get();

            if (vote.getVoteType() == voteType) {
                // User clicked the same button again -> Remove vote (Toggle Off)
                reviewVoteRepository.delete(vote);
                updateReviewCounts(review, -voteType, 0); // Remove the effect
            } else {
                // User changed vote (Like -> Dislike)
                // 1. Remove old effect
                updateReviewCounts(review, -vote.getVoteType(), 0);
                // 2. Update vote
                vote.setVoteType(voteType);
                reviewVoteRepository.save(vote);
                // 3. Add new effect
                updateReviewCounts(review, voteType, 0);
            }
        } else {
            // New Vote
            ReviewVote newVote = new ReviewVote(review, userId, voteType);
            reviewVoteRepository.save(newVote);
            updateReviewCounts(review, voteType, 0);
        }
    }

    // --- 3. Add a Reply ---
    @Transactional
    public Reply addReply(String userId, String username, Long reviewId, String content) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Reply reply = new Reply(review, userId, username, content);
        Reply savedReply = replyRepository.save(reply);

        // Update the "Heat Score" of the parent review (Replies count as activity)
        updateReviewCounts(review, 0, 1);

        return savedReply;
    }

    // --- Helper: Updates the Heat Score counters on the Parent Review ---
    private void updateReviewCounts(Review review, int voteChange, int replyChange) {
        if (voteChange == 1) review.setLikeCount(review.getLikeCount() + 1);
        if (voteChange == -1) review.setDislikeCount(review.getDislikeCount() + 1);

        // If we are removing votes (negative change)
        if (voteChange == -1 && review.getLikeCount() < 0) review.setLikeCount(0); // Safety check (optional)

        review.setReplyCount(review.getReplyCount() + replyChange);

        reviewRepository.save(review);
    }
}