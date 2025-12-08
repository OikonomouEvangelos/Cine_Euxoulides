package com.CineEuxoulides.Euxoulides.MovieCon;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // 1. Get Details (Raw JSON)
    @GetMapping("/movie/{id}")
    public ResponseEntity<String> getMovieDetails(@PathVariable String id) {
        String data = movieService.getMovieDetails(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 2. Get Credits (Java Object) - THIS WAS MISSING
    @GetMapping("/movie/{id}/credits")
    public ResponseEntity<TmdbCreditsResponse> getMovieCredits(@PathVariable String id) {
        TmdbCreditsResponse data = movieService.getMovieCredits(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}