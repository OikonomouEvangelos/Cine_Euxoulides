package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.dto.ReviewDTO;
import com.CineEuxoulides.Euxoulides.model.Reply;
import com.CineEuxoulides.Euxoulides.model.Review;
import com.CineEuxoulides.Euxoulides.model.ReviewVote;
import com.CineEuxoulides.Euxoulides.repository.ReviewRepository;
import com.CineEuxoulides.Euxoulides.repository.ReviewVoteRepository;
import com.CineEuxoulides.Euxoulides.service.ReviewService;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewVoteRepository reviewVoteRepository;

    private Claims getClaimsFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = authHeader.substring(7);
        return JwtUtil.extractAllClaims(token);
    }

    private String getUserIdAsString(Claims claims) {
        return String.valueOf(claims.get("id"));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<ReviewDTO>> getMovieReviews(
            @PathVariable String movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewsPage = reviewRepository.findByMovieId(movieId, pageable);
        Page<ReviewDTO> dtoPage = reviewsPage.map(ReviewDTO::new);

        if (authHeader != null && authHeader.startsWith("Bearer ") && !dtoPage.isEmpty()) {
            try {
                Claims claims = getClaimsFromHeader(authHeader);
                String currentUserId = getUserIdAsString(claims);

                List<Long> reviewIds = reviewsPage.getContent().stream()
                        .map(Review::getId)
                        .collect(Collectors.toList());

                if (!reviewIds.isEmpty()) {
                    List<ReviewVote> myVotes = reviewVoteRepository.findByUserIdAndReviewIdIn(currentUserId, reviewIds);
                    Map<Long, Integer> voteMap = myVotes.stream()
                            .collect(Collectors.toMap(v -> v.getReview().getId(), ReviewVote::getVoteType));

                    dtoPage.forEach(dto -> {
                        if (voteMap.containsKey(dto.getId())) {
                            dto.setCurrentUserVote(voteMap.get(dto.getId()));
                        }
                    });
                }
            } catch (Exception e) { }
        }
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/movie/{movieId}/stats")
    public ResponseEntity<Map<String, Object>> getMovieStats(@PathVariable String movieId) {
        Double avgRating = reviewRepository.getAverageRating(movieId);
        Long totalRatings = reviewRepository.countRatings(movieId);
        Long totalComments = reviewRepository.countComments(movieId);

        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", avgRating != null ? avgRating : 0.0);
        response.put("totalRatings", totalRatings != null ? totalRatings : 0);
        response.put("totalComments", totalComments != null ? totalComments : 0);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addReview(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> payload
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);
            String firstName = claims.get("firstName", String.class);
            String lastName = claims.get("lastName", String.class);
            String username = (firstName != null ? firstName : "User") + " " + (lastName != null ? lastName : "");

            String movieId = String.valueOf(payload.get("movieId"));
            Double rating = payload.get("rating") != null ? ((Number) payload.get("rating")).doubleValue() : null;
            String comment = (String) payload.get("comment");

            Review savedReview = reviewService.saveOrUpdateReview(userId, username, movieId, rating, comment);
            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding review: " + e.getMessage());
        }
    }

    @PostMapping("/{reviewId}/vote")
    public ResponseEntity<String> voteOnReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String authHeader,
            @RequestParam int voteType
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            reviewService.voteOnReview(userId, reviewId, voteType);
            return ResponseEntity.ok("Vote registered");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @PostMapping("/{reviewId}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> payload
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);
            String firstName = claims.get("firstName", String.class);
            String lastName = claims.get("lastName", String.class);
            String username = firstName + " " + lastName;

            String content = payload.get("content");

            Reply reply = reviewService.addReply(userId, username, reviewId, content);
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // --- NEW ENDPOINT: Edit Reply ---
    @PutMapping("/reply/{replyId}")
    public ResponseEntity<?> editReply(
            @PathVariable Long replyId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> payload
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);
            String content = payload.get("content");

            Reply reply = reviewService.editReply(replyId, userId, content);
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            reviewService.deleteReview(reviewId, userId);
            return ResponseEntity.ok("Review deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/reply/{replyId}")
    public ResponseEntity<String> deleteReply(
            @PathVariable Long replyId,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            reviewService.deleteReply(replyId, userId);
            return ResponseEntity.ok("Reply deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}