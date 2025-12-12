package com.CineEuxoulides.Euxoulides.MovieC;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Random; // ✅ Added for randomization

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public MovieService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 1. Get Movie Details
    public String getMovieDetails(String movieId) {
        String url = baseUrl + "/movie/" + movieId + "?api_key=" + apiKey + "&language=en-US";
        try {
            return restTemplate.getForObject(url, String.class);
        } catch (HttpClientErrorException e) {
            System.err.println("Error fetching Movie Details: " + e.getMessage());
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 2. Get Credits
    public TmdbCreditsResponse getMovieCredits(String movieId) {
        String url = baseUrl + "/movie/" + movieId + "/credits?api_key=" + apiKey;
        try {
            return restTemplate.getForObject(url, TmdbCreditsResponse.class);
        } catch (HttpClientErrorException e) {
            System.err.println("Error fetching Credits: " + e.getMessage());
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 3. Get Movies by Genre (WITH RANDOMIZATION)
    public String getMoviesByGenre(String genreId) {

        // ✅ Generate a random page between 1 and 15
        // This ensures the list is different every time you scan
        int randomPage = new Random().nextInt(15) + 1;

        String url = "https://api.themoviedb.org/3/discover/movie" +
                "?api_key=" + apiKey +
                "&with_genres=" + genreId +
                "&sort_by=popularity.desc" +
                "&language=en-US" +
                "&include_adult=false" +
                "&page=" + randomPage; // ✅ Use the random page number

        try {
            System.out.println("Fetching Genre: " + genreId + " | Page: " + randomPage); // Log for debugging
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            System.out.println("Error fetching genre movies: " + e.getMessage());
            return null;
        }
    }
}