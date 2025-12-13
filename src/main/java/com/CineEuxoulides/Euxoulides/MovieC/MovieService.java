package com.CineEuxoulides.Euxoulides.MovieC;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String tmdbUrl;

    // --- CLOUD CONFIGURATION ---
    private final String pythonUrl = "https://cine-ai-server.onrender.com/analyze";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map DeepFace Emotions -> TMDB Genre IDs
    private static final Map<String, String> MOOD_TO_GENRE = new HashMap<>();
    static {
        MOOD_TO_GENRE.put("happy", "35");      // Comedy
        MOOD_TO_GENRE.put("sad", "18");        // Drama
        MOOD_TO_GENRE.put("angry", "28");      // Action
        MOOD_TO_GENRE.put("fear", "27");       // Horror (DeepFace detects 'fear')
        MOOD_TO_GENRE.put("surprise", "878");  // Sci-Fi
        MOOD_TO_GENRE.put("neutral", "99");    // Documentary
        MOOD_TO_GENRE.put("disgust", "10751"); // Family
    }

    public MovieService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // --- 1. Get Movie Details ---
    public String getMovieDetails(String movieId) {
        try {
            return restTemplate.getForObject(tmdbUrl + "/movie/" + movieId + "?api_key=" + apiKey + "&language=en-US", String.class);
        } catch (Exception e) { return null; }
    }

    // --- 2. Get Movie Credits ---
    public TmdbCreditsResponse getMovieCredits(String movieId) {
        try {
            return restTemplate.getForObject(tmdbUrl + "/movie/" + movieId + "/credits?api_key=" + apiKey, TmdbCreditsResponse.class);
        } catch (Exception e) { return null; }
    }

    // --- 3. Analyze Mood (Calls Cloud AI) ---
    public String analyzeMoodAndGetMovies(MultipartFile imageFile) {
        try {
            System.out.println("--- CALLING CLOUD AI ---");
            System.out.println("Target: " + pythonUrl);

            // 1. Setup Headers for File Upload
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 2. Prepare the File Resource
            // We use a custom ByteArrayResource to give the file a name ("image.jpg")
            // otherwise Flask won't recognize it as a file.
            ByteArrayResource fileAsResource = new ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() { return "image.jpg"; }
            };

            // 3. Add file to Body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", fileAsResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 4. Send Request to Render
            ResponseEntity<String> pythonResponse = restTemplate.exchange(pythonUrl, HttpMethod.POST, requestEntity, String.class);

            // 5. Parse Response
            JsonNode root = objectMapper.readTree(pythonResponse.getBody());

            // Check for Python Errors
            if (root.has("error")) {
                System.err.println("CLOUD AI ERROR: " + root.get("error").asText());
                return getFallbackMovies();
            }

            // 6. Extract Mood
            String mood = root.get("label").asText();
            System.out.println("CLOUD DETECTED: " + mood);

            // 7. Get Movies
            String genreId = MOOD_TO_GENRE.getOrDefault(mood.toLowerCase(), "35");
            return getRecommendationsByGenre(genreId);

        } catch (Exception e) {
            System.err.println("CLOUD CONNECTION FAILED: " + e.getMessage());
            System.err.println("Note: If this is the first request in 15 mins, the server might be waking up. Try again in 30s.");
            return getFallbackMovies();
        }
    }


    private String getRecommendationsByGenre(String genreId) {
        String url = tmdbUrl + "/discover/movie?api_key=" + apiKey +
                "&with_genres=" + genreId +
                "&sort_by=popularity.desc&include_adult=false&page=1";
        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) { return null; }
    }

    private String getFallbackMovies() {
        System.out.println("Using Fallback (Popular Movies)...");
        try {
            return restTemplate.getForObject(tmdbUrl + "/movie/popular?api_key=" + apiKey + "&language=en-US&page=1", String.class);
        } catch (Exception e) { return null; }
    }
    // Add this new method to MovieService.java
    public void wakeUpAiServer() {
        try {

            String healthUrl = pythonUrl.replace("/analyze", "/");
            restTemplate.getForObject(healthUrl, String.class);
            System.out.println("--- AI SERVER PINGED (Waking Up) ---");
        } catch (Exception e) {
            // Ignore errors here, we just want to trigger the boot
            System.out.println("AI Wakeup Ping Sent");
        }
    }


}