package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.model.ReviewVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewVoteRepository extends JpaRepository<ReviewVote, Long> {

    List<ReviewVote> findAllByUserIdAndReviewId(String userId, Long reviewId);

    List<ReviewVote> findByUserIdAndReviewIdIn(String userId, List<Long> reviewIds);

    // NEW: Allows deleting all votes for a specific review
    void deleteAllByReviewId(Long reviewId);
}