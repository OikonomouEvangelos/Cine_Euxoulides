package com.CineEuxoulides.Euxoulides.MovieCon;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

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
}