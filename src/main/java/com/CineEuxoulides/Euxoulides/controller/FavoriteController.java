package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.model.Favorite;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import com.CineEuxoulides.Euxoulides.service.FavoriteService;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin("*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private Claims getClaimsFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = authHeader.substring(7);
        return JwtUtil.extractAllClaims(token);
    }

    // NEW HELPER: Converts ID to String
    private String getUserIdAsString(Claims claims) {
        return String.valueOf(claims.get("id"));
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> payload
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            // Convert incoming Movie ID to String safely
            String movieId = String.valueOf(payload.get("movieId"));

            boolean isFavorite = favoriteService.toggleFavorite(userId, movieId);
            return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkFavorite(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String movieId // Receive as String
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            boolean exists = favoriteRepository.existsByUserIdAndMovieId(userId, movieId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyFavorites(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            Pageable pageable = PageRequest.of(page, size, Sort.by("addedAt").descending());
            return ResponseEntity.ok(favoriteRepository.findByUserId(userId, pageable));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}