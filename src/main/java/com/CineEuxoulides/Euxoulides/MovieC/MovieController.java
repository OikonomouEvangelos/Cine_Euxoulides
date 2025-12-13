package com.CineEuxoulides.Euxoulides.MovieC;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allow React (Vite) to talk to Spring Boot
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // --- 1. Get Movie Details (JSON) ---
    @GetMapping("/movie/{id}")
    public ResponseEntity<String> getMovieDetails(@PathVariable String id) {
        String data = movieService.getMovieDetails(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- 2. Get Movie Credits (Java Object) ---
    @GetMapping("/movie/{id}/credits")
    public ResponseEntity<TmdbCreditsResponse> getMovieCredits(@PathVariable String id) {
        TmdbCreditsResponse data = movieService.getMovieCredits(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- 3. MOOD SCANNER ENDPOINT ---
    // React sends the image here -> We send it to AI -> Return Movie JSON
    @PostMapping("/movies/analyze-mood")
    public ResponseEntity<String> analyzeMood(@RequestParam("image") MultipartFile image) {
        // 1. Validation
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is missing.");
        }

        // 2. Call Service
        String result = movieService.analyzeMoodAndGetMovies(image);

        // 3. Return Result
        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.internalServerError().body("Error: AI analysis failed. Check Java console.");
        }
    }
}