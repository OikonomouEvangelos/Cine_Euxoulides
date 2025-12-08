package com.CineEuxoulides.Euxoulides;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EuxoulidesApplication {

    public static void main(String[] args) {
        // 1. Load .env file safely
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // 2. Load API Key into System Properties
        String apiKey = dotenv.get("TMDB_API_KEY");
        if (apiKey != null) {
            System.setProperty("TMDB_API_KEY", apiKey);
        }

        // 3. Start Spring
        SpringApplication.run(EuxoulidesApplication.class, args);
    }
}