package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.domain.Favorite;
import com.CineEuxoulides.Euxoulides.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Transactional
    public boolean toggleFavorite(String userId, String movieIdString, String genreIds) {

        // Μετατροπή του ID από String σε Long (γιατί έτσι το θέλει η βάση πλέον)
        Long movieId;
        try {
            movieId = Long.parseLong(movieIdString);
        } catch (NumberFormatException e) {
            System.err.println("Invalid movie ID format: " + movieIdString);
            return false;
        }

        // Έλεγχος αν υπάρχει ήδη
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndMovieId(userId, movieId);

        if (existing.isPresent()) {
            // Αν υπάρχει, το σβήνουμε (Un-like)
            favoriteRepository.delete(existing.get());
            return false; // Επιστρέφουμε false (δεν είναι πια αγαπημένο)
        } else {
            // Αν δεν υπάρχει, το προσθέτουμε (Like)
            // ΣΗΜΑΝΤΙΚΟ: Αποθηκεύουμε και τα genreIds για να δουλεύει το Blend
            if (genreIds == null) genreIds = ""; // Ασφάλεια αν λείπουν τα είδη

            Favorite favorite = new Favorite(userId, movieId, genreIds);
            favoriteRepository.save(favorite);
            return true; // Επιστρέφουμε true (έγινε αγαπημένο)
        }
    }
}