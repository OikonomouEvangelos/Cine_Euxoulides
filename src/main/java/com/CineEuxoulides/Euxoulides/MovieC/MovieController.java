package com.CineEuxoulides.Euxoulides.MovieC;

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
        String data = movieService.getMovieDetails(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/movie/{id}/credits")
    public ResponseEntity<TmdbCreditsResponse> getMovieCredits(@PathVariable String id) {
        TmdbCreditsResponse data = movieService.getMovieCredits(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/movies/analyze-mood")
    public ResponseEntity<String> analyzeMood(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is missing.");
        }

        String result = movieService.analyzeMoodAndGetMovies(image);

        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.internalServerError().body("Error: AI analysis failed.");
        }
    }


    @GetMapping("/movie/{id}/trailer")
    public ResponseEntity<String> getMovieTrailer(@PathVariable String id) {

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

                    if ("YouTube".equals(site) && "Trailer".equals(type)) {
                        trailerKey = video.path("key").asText();
                        break;
                    }
                }
            }


            if (trailerKey == null && results.isArray() && results.size() > 0) {
                trailerKey = results.get(0).path("key").asText();
            }


            if (trailerKey != null) {
                return ResponseEntity.ok(trailerKey);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching trailer");
        }
    }
}