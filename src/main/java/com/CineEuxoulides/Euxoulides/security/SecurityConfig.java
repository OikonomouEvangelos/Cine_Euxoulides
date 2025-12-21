package com.CineEuxoulides.Euxoulides.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Απενεργοποίηση CSRF για να δουλεύουν τα POST αιτήματα
                .csrf(csrf -> csrf.disable())

                // 2. Ενεργοποίηση CORS με τις ρυθμίσεις που ορίζουμε παρακάτω
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Επιτρέπουμε όλα τα requests (Permit All)
                // Επειδή οι Controllers σου διαχειρίζονται την ασφάλεια χειροκίνητα
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ΕΠΙΤΡΕΠΟΥΜΕ ΚΑΙ ΤΟ 5173 ΚΑΙ ΤΟ 5174 ΓΙΑ ΝΑ ΜΗΝ ΥΠΑΡΧΕΙ ΜΠΛΟΚΑΡΙΣΜΑ CORS
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174"
        ));

        // Επιτρέπουμε όλες τις μεθόδους HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Επιτρέπουμε τα απαραίτητα Headers (Authorization για το JWT token)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Επιτρέπουμε τα credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}