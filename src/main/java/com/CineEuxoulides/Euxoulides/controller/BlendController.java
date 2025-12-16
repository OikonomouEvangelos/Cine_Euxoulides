package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.Favorite;
import com.CineEuxoulides.Euxoulides.domain.User;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import com.CineEuxoulides.Euxoulides.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blend")
@CrossOrigin("*")
public class BlendController {

    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;

    @Value("${tmdb.api-key}")
    private String tmdbApiKey;

    public BlendController(UserRepository userRepository, FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping("/generate")
    public ResponseEntity<?> generateBlend(@RequestParam Long user1Id, @RequestParam Long user2Id) {

        // 1. Ελέγχουμε αν υπάρχουν οι χρήστες
        if (!userRepository.existsById(user1Id) || !userRepository.existsById(user2Id)) {
            return ResponseEntity.badRequest().body("Users not found");
        }

        // 2. Παίρνουμε τα αγαπημένα τους (Χρησιμοποιώντας String IDs)
        List<Favorite> favs1 = favoriteRepository.findByUserId(String.valueOf(user1Id));
        List<Favorite> favs2 = favoriteRepository.findByUserId(String.valueOf(user2Id));

        if (favs1.isEmpty() || favs2.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Not enough data for blend"));
        }

        // 3. Βρίσκουμε τα κοινά είδη (Genres)
        Map<String, Integer> genreCounts = new HashMap<>();
        countGenres(favs1, genreCounts);
        countGenres(favs2, genreCounts);

        String topGenres = genreCounts.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(2)
                .map(Map.Entry::getKey)
                .collect(Collectors.joining(","));

        // 4. Καλούμε το TMDB
        String url = "https://api.themoviedb.org/3/discover/movie?api_key=" + tmdbApiKey
                + "&with_genres=" + topGenres
                + "&sort_by=popularity.desc&page=1";

        RestTemplate restTemplate = new RestTemplate();
        Object response = restTemplate.getForObject(url, Object.class);

        return ResponseEntity.ok(response);
    }

    private void countGenres(List<Favorite> favorites, Map<String, Integer> counts) {
        for (Favorite fav : favorites) {
            if (fav.getGenreIds() != null && !fav.getGenreIds().isEmpty()) {
                String[] ids = fav.getGenreIds().split(",");
                for (String id : ids) {
                    counts.put(id.trim(), counts.getOrDefault(id.trim(), 0) + 1);
                }
            }
        }
    }
}