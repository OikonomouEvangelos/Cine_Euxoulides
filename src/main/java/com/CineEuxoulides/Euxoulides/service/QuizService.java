package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.domain.QuizQuestion;
import com.CineEuxoulides.Euxoulides.domain.UserQuizAttempt;
import com.CineEuxoulides.Euxoulides.repository.UserQuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // <-- ΣΗΜΑΝΤΙΚΟ IMPORT
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final UserQuizAttemptRepository userQuizAttemptRepository;

    // ΑΛΛΑΓΗ: Πλέον δεν γράφουμε το κλειδί εδώ.
    // Η Java θα το "τραβήξει" από το application.yaml -> Environment Variables
    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    @Autowired
    public QuizService(UserQuizAttemptRepository userQuizAttemptRepository) {
        this.userQuizAttemptRepository = userQuizAttemptRepository;
    }

    public UserQuizAttempt saveAttempt(UserQuizAttempt attempt) {
        return userQuizAttemptRepository.save(attempt);
    }

    public List<UserQuizAttempt> getLeaderboard() {
        return userQuizAttemptRepository.findAllByOrderByScoreDesc();
    }

    public List<QuizQuestion> generateQuizQuestions(String difficulty) {
        RestTemplate restTemplate = new RestTemplate();

        // Φτιάχνουμε το URL δυναμικά χρησιμοποιώντας το κρυφό κλειδί
        String tmdbUrl = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=" + tmdbApiKey;

        // System.out.println("Calling TMDB URL..."); // Καλό είναι να μην τυπώνουμε το URL με το κλειδί για ασφάλεια

        try {
            Map<String, Object> response = restTemplate.getForObject(tmdbUrl, Map.class);

            if (response == null || !response.containsKey("results")) {
                System.out.println("No results from TMDB");
                return new ArrayList<>();
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            List<QuizQuestion> questions = new ArrayList<>();

            Collections.shuffle(results);
            int limit = Math.min(results.size(), 20);

            for (int i = 0; i < limit; i++) {
                Map<String, Object> movie = results.get(i);
                String title = (String) movie.get("title");
                String overview = (String) movie.get("overview");
                String releaseDate = (String) movie.get("release_date");

                if (title == null || releaseDate == null || releaseDate.isEmpty()) continue;

                QuizQuestion q = new QuizQuestion();
                q.setMovieId(String.valueOf(movie.get("id")));
                q.setDifficulty(difficulty);

                if ("EASY".equalsIgnoreCase(difficulty)) {
                    q.setQuestionText("Ποια ταινία έχει την εξής πλοκή: " + overview);
                } else {
                    q.setQuestionText("Ποια χρονιά κυκλοφόρησε η ταινία '" + title + "';");
                }

                List<String> options = new ArrayList<>();
                if ("EASY".equalsIgnoreCase(difficulty)) {
                    options.add(title);
                    options.addAll(getWrongTitles(results, title));
                } else {
                    String year = releaseDate.split("-")[0];
                    try {
                        int y = Integer.parseInt(year);
                        options.add(year);
                        options.add(String.valueOf(y + 1));
                        options.add(String.valueOf(y - 2));
                        options.add(String.valueOf(y + 5));
                    } catch (NumberFormatException e) {
                        continue;
                    }
                }
                Collections.shuffle(options);
                q.setOptions(options);

                String correctAnswer = "EASY".equalsIgnoreCase(difficulty) ? title : releaseDate.split("-")[0];
                q.setCorrectAnswerIndex(options.indexOf(correctAnswer));

                questions.add(q);
            }
            return questions;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<String> getWrongTitles(List<Map<String, Object>> allMovies, String correctTitle) {
        return allMovies.stream()
                .map(m -> (String) m.get("title"))
                .filter(title -> title != null && !title.equals(correctTitle))
                .limit(3)
                .collect(Collectors.toList());
    }
}