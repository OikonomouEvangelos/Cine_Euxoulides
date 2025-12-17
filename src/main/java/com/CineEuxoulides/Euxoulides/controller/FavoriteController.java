package com.CineEuxoulides.Euxoulides.controller;

// 1. ΔΙΟΡΘΩΣΗ: Σωστό Import (domain αντί για model)
import com.CineEuxoulides.Euxoulides.domain.Favorite;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import com.CineEuxoulides.Euxoulides.service.FavoriteService;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

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

            // Μετατροπή Movie ID σε String
            String movieId = String.valueOf(payload.get("movieId"));

            // 2. ΔΙΟΡΘΩΣΗ: Διαβάζουμε και τα genreIds για το Blend
            String genreIds = (String) payload.get("genreIds");
            if (genreIds == null) {
                genreIds = ""; // Ασφάλεια για να μην σκάσει αν λείπει
            }

            // Καλούμε το Service με τις 3 παραμέτρους
            boolean isFavorite = favoriteService.toggleFavorite(userId, movieId, genreIds);

            return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkFavorite(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String movieId // Έρχεται ως String από το URL
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            // 3. ΔΙΟΡΘΩΣΗ: Μετατροπή σε Long και χρήση του findBy...
            Long movieIdLong = Long.parseLong(movieId);

            Optional<Favorite> fav = favoriteRepository.findByUserIdAndMovieId(userId, movieIdLong);

            return ResponseEntity.ok(fav.isPresent());
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

            // Επιστρέφει Page<Favorite> όπως το ορίσαμε στο Repository
            return ResponseEntity.ok(favoriteRepository.findByUserId(userId, pageable));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}