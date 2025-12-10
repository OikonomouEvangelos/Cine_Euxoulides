package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.model.Favorite;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import com.CineEuxoulides.Euxoulides.service.FavoriteService;
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
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        Long movieId = ((Number) payload.get("movieId")).longValue();

        boolean isFavorite = favoriteService.toggleFavorite(userId, movieId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFavorite(
            @RequestParam String userId,
            @RequestParam Long movieId
    ) {
        boolean exists = favoriteRepository.existsByUserIdAndMovieId(userId, movieId);
        return ResponseEntity.ok(exists);
    }

    // Endpoint to list favorites (for the Favorites Page later)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Favorite>> getUserFavorites(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("addedAt").descending());
        return ResponseEntity.ok(favoriteRepository.findByUserId(userId, pageable));
    }
}