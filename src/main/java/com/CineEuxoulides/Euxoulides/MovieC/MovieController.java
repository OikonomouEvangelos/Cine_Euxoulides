package com.CineEuxoulides.Euxoulides.MovieC;

import lombok.extern.slf4j.Slf4j; // 1. Import Lombok Logger
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j // 2. Add the Annotation to enable 'log'
public class MovieController {

    private final MovieService movieService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/movie/{id}")
    public ResponseEntity<String> getMovieDetails(@PathVariable String id) {
        log.info("Request received: Fetch details for movie ID: {}", id); // Log request

        String data = movieService.getMovieDetails(id);

        if (data != null) {
            log.debug("Successfully fetched details for movie ID: {}", id);
            return ResponseEntity.ok(data);
        } else {
            log.warn("Movie details not found for ID: {}", id); // Warn if missing
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/movie/{id}/credits")
    public ResponseEntity<TmdbCreditsResponse> getMovieCredits(@PathVariable String id) {
        log.info("Request received: Fetch credits for movie ID: {}", id);

        TmdbCreditsResponse data = movieService.getMovieCredits(id);

        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            log.warn("Credits not found for movie ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/movies/analyze-mood")
    public ResponseEntity<String> analyzeMood(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            log.warn("Mood analysis failed: Image file is missing.");
            return ResponseEntity.badRequest().body("Image file is missing.");
        }

        log.info("Request received: Analyze mood for image: {}", image.getOriginalFilename());

        try {
            String result = movieService.analyzeMoodAndGetMovies(image);

            if (result != null) {
                log.info("Mood analysis successful for image: {}", image.getOriginalFilename());
                return ResponseEntity.ok(result);
            } else {
                log.error("AI analysis returned null result.");
                return ResponseEntity.internalServerError().body("Error: AI analysis failed.");
            }
        } catch (Exception e) {
            log.error("Exception during mood analysis", e);
            return ResponseEntity.internalServerError().body("Error analyzing mood");
        }
    }

    @GetMapping("/movie/{id}/trailer")
    public ResponseEntity<String> getMovieTrailer(@PathVariable String id) {
        log.info("Request received: Fetch trailer for movie ID: {}", id);

        String url = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=" + tmdbApiKey;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode results = root.path("results");

            String trailerKey = null;

            if (results.isArray()) {
                for (JsonNode video : results) {
                    String site = video.path("site").asText();
                    String type = video.path("type").asText();

                    // Prioritize YouTube Trailers
                    if ("YouTube".equals(site) && "Trailer".equals(type)) {
                        trailerKey = video.path("key").asText();
                        break;
                    }
                }
            }

            // Fallback: Use the first video if no specific trailer found
            if (trailerKey == null && results.isArray() && results.size() > 0) {
                log.debug("No specific 'Trailer' found for ID {}, using first video result.", id);
                trailerKey = results.get(0).path("key").asText();
            }

            if (trailerKey != null) {
                log.debug("Trailer found for ID {}: {}", id, trailerKey);
                return ResponseEntity.ok(trailerKey);
            } else {
                log.warn("No trailer found for movie ID: {}", id);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            // CRITICAL FIX: Use log.error instead of printStackTrace
            log.error("Failed to fetch trailer for movie ID: {}", id, e);
            return ResponseEntity.status(500).body("Error fetching trailer");
        }
    }
}