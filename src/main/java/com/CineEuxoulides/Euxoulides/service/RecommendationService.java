package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.domain.Favorite;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> getRecommendationsForUser(String userId) {
        // 1. Get user's last 5 favorites to use as seeds
        List<Favorite> favorites = favoriteRepository.findByUserId(
                userId,
                PageRequest.of(0, 5, Sort.by("addedAt").descending())
        ).getContent();

        List<String> favoriteIds = favorites.stream()
                // Μετατρέπουμε τον αριθμό σε String
                .map(favorite -> String.valueOf(favorite.getMovieId()))
                .collect(Collectors.toList());

        // 2. If no favorites, fallback to Trending
        if (favoriteIds.isEmpty()) {
            return fetchTrendingMovies();
        }

        // 3. Fetch recommendations for each seed
        List<Map<String, Object>> mixedRecommendations = new ArrayList<>();
        Set<String> seenMovieIds = new HashSet<>(favoriteIds); // Don't recommend what they already liked

        for (String seedId : favoriteIds) {
            List<Map<String, Object>> recs = fetchTmdbRecommendations(seedId);
            for (Map<String, Object> movie : recs) {
                String id = String.valueOf(movie.get("id"));
                // Deduplicate
                if (!seenMovieIds.contains(id)) {
                    mixedRecommendations.add(movie);
                    seenMovieIds.add(id);
                }
            }
        }

        // 4. Shuffle to mix genres
        Collections.shuffle(mixedRecommendations);

        // 5. Limit to 20 items
        return mixedRecommendations.stream().limit(20).collect(Collectors.toList());
    }

    private List<Map<String, Object>> fetchTmdbRecommendations(String movieId) {
        String url = String.format("%s/movie/%s/recommendations?api_key=%s&language=en-US&page=1", baseUrl, movieId, apiKey);
        try {
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                return (List<Map<String, Object>>) response.get("results");
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch recs for movie " + movieId + ": " + e.getMessage());
        }
        return new ArrayList<>();
    }

    private List<Map<String, Object>> fetchTrendingMovies() {
        String url = String.format("%s/trending/movie/week?api_key=%s", baseUrl, apiKey);
        try {
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                return (List<Map<String, Object>>) response.get("results");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }
}