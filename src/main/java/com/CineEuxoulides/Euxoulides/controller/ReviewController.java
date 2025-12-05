package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.model.Reply;
import com.CineEuxoulides.Euxoulides.model.Review;
import com.CineEuxoulides.Euxoulides.repository.ReviewRepository;
import com.CineEuxoulides.Euxoulides.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173") // Allows your React Frontend to talk to this Backend
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    // --- 1. Get Reviews for a Movie (The "Smart Feed") ---
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<Review>> getMovieReviews(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String currentUserId // Optional: to put user's own review at top
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews;

        if (currentUserId != null) {
            reviews = reviewRepository.findByMovieIdAndUserIdNot(movieId, currentUserId, pageable);
        } else {
            reviews = reviewRepository.findByMovieId(movieId, pageable);
        }
        return ResponseEntity.ok(reviews);
    }

    // --- 2. Get Statistics (For the Hover Box) ---
    @GetMapping("/movie/{movieId}/stats")
    public ResponseEntity<Map<String, Object>> getMovieStats(@PathVariable Long movieId) {
        Double avgRating = reviewRepository.getAverageRating(movieId);
        Long totalRatings = reviewRepository.countRatings(movieId);
        Long totalComments = reviewRepository.countComments(movieId);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", avgRating != null ? avgRating : 0.0);
        response.put("totalRatings", totalRatings != null ? totalRatings : 0);
        response.put("totalComments", totalComments != null ? totalComments : 0);

        return ResponseEntity.ok(response);
    }

    // --- 3. Add or Update a Review ---
    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String username = (String) payload.get("username");
        Long movieId = ((Number) payload.get("movieId")).longValue();

        // Handle nullable rating/comment safely
        Double rating = payload.get("rating") != null ? ((Number) payload.get("rating")).doubleValue() : null;
        String comment = (String) payload.get("comment");

        Review savedReview = reviewService.saveOrUpdateReview(userId, username, movieId, rating, comment);
        return ResponseEntity.ok(savedReview);
    }

    // --- 4. Vote on a Review (Like/Dislike) ---
    @PostMapping("/{reviewId}/vote")
    public ResponseEntity<String> voteOnReview(
            @PathVariable Long reviewId,
            @RequestParam String userId,
            @RequestParam int voteType // 1 for Like, -1 for Dislike
    ) {
        reviewService.voteOnReview(userId, reviewId, voteType);
        return ResponseEntity.ok("Vote registered successfully");
    }

    // --- 5. Add a Reply ---
    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<Reply> addReply(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> payload
    ) {
        String userId = payload.get("userId");
        String username = payload.get("username");
        String content = payload.get("content");

        Reply reply = reviewService.addReply(userId, username, reviewId, content);
        return ResponseEntity.ok(reply);
    }
}