package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.User;
import com.CineEuxoulides.Euxoulides.dto.AuthResponse;
import com.CineEuxoulides.Euxoulides.repository.UserRepository;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.CineEuxoulides.Euxoulides.dto.GoogleLoginRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;
import java.util.Optional;
import java.util.Collections;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;

    @Value("${google.client-id}")
    private String googleClientId;


    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =======================
    //  REGISTER (ΕΓΓΡΑΦΗ)
    // =======================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {

        String firstName = body.get("firstName");
        String lastName  = body.get("lastName");
        String email     = body.get("email");
        String password  = body.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password); // (αργότερα: hash)

        userRepository.save(user);

        // ΜΟΛΙΣ γραφτεί, δημιουργούμε token και τον θεωρούμε logged-in
        String token = JwtUtil.generateToken(user);

        AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );

        return ResponseEntity.ok(authResponse);
    }

    // =======================
    //  LOGIN (ΣΥΝΔΕΣΗ)
    // =======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email    = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        // Αν όλα καλά → δημιουργούμε token
        String token = JwtUtil.generateToken(user);

        AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            String idTokenString = request.getIdToken();
            if (idTokenString == null || idTokenString.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            var transport = GoogleNetHttpTransport.newTrustedTransport();
            var jsonFactory = GsonFactory.getDefaultInstance();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                // Το token από το Google **ΔΕΝ** είναι έγκυρο
                return ResponseEntity.status(401).build();
            }

            Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            // 1. Βρίσκουμε ή δημιουργούμε χρήστη
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User u = new User();
                        u.setEmail(email);
                        u.setFirstName(firstName != null ? firstName : "");
                        u.setLastName(lastName != null ? lastName : "");
                        // Αν στο User έχεις και άλλα required πεδία (π.χ. role),
                        // βάλε εδώ κάποια default τιμή.
                        u.setPassword("GOOGLE_USER");

                        return userRepository.save(u);
                    });

            // 2. Φτιάχνουμε JWT token όπως στο κανονικό login
            String token = JwtUtil.generateToken(user);

            // 3. Φτιάχνουμε την απάντηση προς το frontend
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

}
