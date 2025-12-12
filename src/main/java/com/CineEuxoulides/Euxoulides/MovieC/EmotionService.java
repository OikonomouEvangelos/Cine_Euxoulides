package com.CineEuxoulides.Euxoulides.MovieC;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmotionService {

    private final String HF_API_URL = "https://api-inference.huggingface.co/models/dima806/facial_emotions_image_detection";
    private final String HF_TOKEN = "Bearer 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";
    private final RestTemplate restTemplate;

    public EmotionService() {
        this.restTemplate = new RestTemplate();
    }

    public String detectEmotion(byte[] imageBytes) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", HF_TOKEN);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM); // We are sending raw image bytes

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(imageBytes, headers);

        try {

            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    HF_API_URL,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );


            List<Map<String, Object>> predictions = response.getBody();
            if (predictions != null && !predictions.isEmpty()) {
                // The first item in the list is always the highest confidence prediction
                Map<String, Object> topPrediction = predictions.get(0);
                String detectedEmotion = (String) topPrediction.get("label");

                System.out.println("AI Detected: " + detectedEmotion);
                return detectedEmotion;
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error calling Hugging Face: " + e.getMessage());
        }

        return "neutral";
    }
}