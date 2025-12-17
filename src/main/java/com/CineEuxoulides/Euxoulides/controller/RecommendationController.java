package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.service.RecommendationService;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    private Claims getClaimsFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }
        String token = authHeader.substring(7);
        return JwtUtil.extractAllClaims(token);
    }

    private String getUserIdAsString(Claims claims) {
        return String.valueOf(claims.get("id"));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Claims claims = getClaimsFromHeader(authHeader);
            String userId = getUserIdAsString(claims);

            List<Map<String, Object>> movies = recommendationService.getRecommendationsForUser(userId);
            return ResponseEntity.ok(movies);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }
}