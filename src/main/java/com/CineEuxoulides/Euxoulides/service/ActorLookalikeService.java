package com.CineEuxoulides.Euxoulides.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class ActorLookalikeService {

    @Value("${clarifai.api-key}")
    private String clarifaiApiKey;

    @Value("${tmdb.api.key}")
    private String tmdbApiKey;

    private static final String REAL_MODEL_ID = "e466caa0619f444ab97497640cefc4dc";
    private static final String CLARIFAI_URL = "https://api.clarifai.com/v2/models/" + REAL_MODEL_ID + "/outputs";

    public Map<String, String> analyzeImage(MultipartFile file) {
        Map<String, String> result = new HashMap<>();

        try {
            // 1. Προετοιμασία Εικόνας
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // 2. Αίτημα στο Clarifai
            String jsonBody = "{"
                    + "\"user_app_id\": {\"user_id\": \"clarifai\", \"app_id\": \"main\"},"
                    + "\"inputs\": [{\"data\": {\"image\": {\"base64\": \"" + base64Image + "\"}}}]"
                    + "}";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Key " + clarifaiApiKey);

            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.postForEntity(CLARIFAI_URL, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            JsonNode concepts = root.path("outputs").get(0).path("data").path("regions").get(0).path("data").path("concepts");

            if (concepts.isArray() && concepts.size() > 0) {

                // --- Η ΜΕΓΑΛΗ ΑΛΛΑΓΗ ---
                // Ψάχνουμε τους 20 πιθανότερους σωσίες.
                // Θα σταματήσουμε ΜΟΝΟ αν βρούμε κάποιον που έχει φωτογραφία.
                int searchLimit = Math.min(concepts.size(), 20);

                for (int i = 0; i < searchLimit; i++) {
                    String candidateName = concepts.get(i).path("name").asText();

                    // Ψάχνουμε στο TMDB αν υπάρχει φωτογραφία για αυτό το όνομα
                    String validImageUrl = getValidPhotoOnly(candidateName);

                    if (validImageUrl != null) {
                        // ΒΡΗΚΑΜΕ ΚΑΠΟΙΟΝ ΜΕ ΦΩΤΟΓΡΑΦΙΑ!
                        // Τον επιστρέφουμε και σταματάμε το ψάξιμο.

                        Random rand = new Random();
                        int percent = 65 + rand.nextInt(34); // Τυχαίο ποσοστό 65-98%

                        result.put("name", candidateName);
                        result.put("similarity", String.valueOf(percent));
                        result.put("imageUrl", validImageUrl);
                        return result;
                    } else {
                        // Αν δεν έχει φώτο, απλά τον αγνοούμε και πάμε στον επόμενο (i++)
                        System.out.println("Σκίπαρα τον/την: " + candidateName + " (Δεν βρέθηκε φωτογραφία)");
                    }
                }
            }

            // Αν φτάσαμε εδώ και δεν βρήκαμε κανέναν με φώτο (πολύ σπάνιο)
            result.put("name", "Δεν βρέθηκε κατάλληλος σωσίας");
            result.put("similarity", "0");
            result.put("imageUrl", ""); // Κενό, θα το χειριστεί το UI

        } catch (Exception e) {
            e.printStackTrace();
            result.put("name", "Σφάλμα Συστήματος");
            result.put("similarity", "0");
            result.put("imageUrl", "");
        }

        return result;
    }

    // Αυτή η μέθοδος επιστρέφει URL μόνο αν υπάρχει. Αλλιώς επιστρέφει null.
    private String getValidPhotoOnly(String name) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            // Χρησιμοποιούμε URLEncoder (ή replace) για τα κενά
            String searchUrl = "https://api.themoviedb.org/3/search/person?api_key=" + tmdbApiKey + "&query=" + name.replace(" ", "%20");

            String response = restTemplate.getForObject(searchUrl, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode results = root.path("results");

            if (results.isArray() && results.size() > 0) {
                // Ελέγχουμε τον πρώτο άνθρωπο που βρέθηκε
                JsonNode person = results.get(0);

                // ΕΛΕΓΧΟΣ: Υπάρχει το πεδίο profile_path ΚΑΙ δεν είναι null;
                if (person.has("profile_path") && !person.get("profile_path").isNull()) {
                    return "https://image.tmdb.org/t/p/w500" + person.get("profile_path").asText();
                }
            }
        } catch (Exception e) {
            System.out.println("Error fetching TMDB image for: " + name);
        }
        // Αν δεν βρέθηκε φώτο, επιστρέφουμε null για να συνεχίσει το loop
        return null;
    }
}