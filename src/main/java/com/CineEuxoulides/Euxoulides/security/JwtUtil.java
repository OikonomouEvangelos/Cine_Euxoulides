package com.CineEuxoulides.Euxoulides.security;

import com.CineEuxoulides.Euxoulides.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    // Μυστικό κλειδί (για παράδειγμα). Σε σοβαρό project το βάζουμε σε env variable.
    private static final String SECRET = "mySuperSecretKeyForJwtCineEuxoulides123456";

    // Διάρκεια ζωής token: π.χ. 24 ώρες
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000;

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    // Δημιουργεί token με βάση τον χρήστη
    public static String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(user.getEmail())          // κύριο subject = email
                .claim("id", user.getId())            // επιπλέον πληροφορίες
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
