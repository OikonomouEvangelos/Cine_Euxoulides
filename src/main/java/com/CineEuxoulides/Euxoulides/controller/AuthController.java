package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.User;
import com.CineEuxoulides.Euxoulides.dto.AuthResponse;
import com.CineEuxoulides.Euxoulides.repository.UserRepository;
import com.CineEuxoulides.Euxoulides.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;

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
}
