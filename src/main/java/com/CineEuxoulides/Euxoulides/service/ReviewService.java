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
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewVoteRepository reviewVoteRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Transactional
    public Review saveOrUpdateReview(String userId, String username, String movieId, Double rating, String comment) {
        Optional<Review> existing = reviewRepository.findByUserIdAndMovieId(userId, movieId);

        if (existing.isPresent()) {
            Review review = existing.get();
            if (rating != null) review.setRating(rating);
            if (comment != null && !comment.equals(review.getComment())) {
                review.setComment(comment);
                review.setEdited(true);
            } else if (comment != null) {
                review.setComment(comment);
            }
            review.setUpdatedAt(LocalDateTime.now());
            return reviewRepository.save(review);
        } else {
            Review newReview = new Review(userId, username, movieId, rating, comment);
            return reviewRepository.save(newReview);
        }
    }

    @Transactional
    public synchronized void voteOnReview(String userId, Long reviewId, int voteType) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (review.getUserId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own review.");
        }

        List<ReviewVote> existingVotes = reviewVoteRepository.findAllByUserIdAndReviewId(userId, reviewId);

        boolean wasLike = false;
        boolean wasDislike = false;

        // Cleanup existing votes
        for (ReviewVote vote : existingVotes) {
            if (vote.getVoteType() == 1) {
                wasLike = true;
                review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
            } else if (vote.getVoteType() == -1) {
                wasDislike = true;
                review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
            }
            reviewVoteRepository.delete(vote);
        }
        reviewVoteRepository.flush();

        boolean shouldAdd = true;
        if (voteType == 1 && wasLike) shouldAdd = false;
        if (voteType == -1 && wasDislike) shouldAdd = false;

        if (shouldAdd) {
            ReviewVote newVote = new ReviewVote(review, userId, voteType);
            reviewVoteRepository.save(newVote);

            if (voteType == 1) {
                review.setLikeCount(review.getLikeCount() + 1);
            } else if (voteType == -1) {
                review.setDislikeCount(review.getDislikeCount() + 1);
            }
        }
        reviewRepository.save(review);
    }

    @Transactional
    public Reply addReply(String userId, String username, Long reviewId, String content) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Reply reply = new Reply(review, userId, username, content);
        Reply savedReply = replyRepository.save(reply);
        updateReviewCounts(review, 0, 1);
        return savedReply;
    }

    @Transactional
    public Reply editReply(Long replyId, String userId, String newContent) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        if (!reply.getUserId().equals(userId)) {
            throw new RuntimeException("You can only edit your own reply");
        }

        reply.setContent(newContent);
        reply.setEdited(true);
        reply.setUpdatedAt(LocalDateTime.now());
        return replyRepository.save(reply);
    }

    // --- UPDATED DELETE METHOD ---
    @Transactional
    public void deleteReview(Long reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own review");
        }

        // 1. Manually delete all votes linked to this review first
        // This prevents the "Foreign Key Constraint" error
        reviewVoteRepository.deleteAllByReviewId(reviewId);

        // 2. Delete the review (Replies will be deleted automatically by Cascade)
        reviewRepository.delete(review);
    }

    @Transactional
    public void deleteReply(Long replyId, String userId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("Reply not found"));

        if (!reply.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reply");
        }

        Review parent = reply.getReview();
        replyRepository.delete(reply);

        // Decrement reply count safely
        parent.setReplyCount(Math.max(0, parent.getReplyCount() - 1));
        reviewRepository.save(parent);
    }

    private void updateReviewCounts(Review review, int voteChange, int replyChange) {
        if (voteChange == 1) review.setLikeCount(review.getLikeCount() + 1);
        if (voteChange == -1) review.setDislikeCount(review.getDislikeCount() + 1);
        review.setReplyCount(review.getReplyCount() + replyChange);
        reviewRepository.save(review);
    }
}