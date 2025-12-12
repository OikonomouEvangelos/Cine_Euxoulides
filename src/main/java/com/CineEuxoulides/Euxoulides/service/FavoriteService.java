package com.CineEuxoulides.Euxoulides.service;

import com.CineEuxoulides.Euxoulides.model.Favorite;
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
    // CHANGED: Arguments are now String
    public boolean toggleFavorite(String userId, String movieId) {
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndMovieId(userId, movieId);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false;
        } else {
            Favorite favorite = new Favorite(userId, movieId);
            favoriteRepository.save(favorite);
            return true;
        }
    }
}