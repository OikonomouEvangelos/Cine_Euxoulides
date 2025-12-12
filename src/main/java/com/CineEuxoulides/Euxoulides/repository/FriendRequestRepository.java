package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.domain.FriendRequest;
import com.CineEuxoulides.Euxoulides.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    // 1. Βρες όλα τα αιτήματα που έχει λάβει ένας χρήστης με συγκεκριμένο status (π.χ. "PENDING")
    // Αυτό θα το χρειαστούμε για να δείξουμε τη λίστα "Αιτήματα Φιλίας"
    List<FriendRequest> findByReceiverAndStatus(User receiver, String status);

    // 2. Βρες αν υπάρχει ήδη αίτημα από τον χρήστη A στον χρήστη B
    // Αυτό το χρειαστήκαμε στον Controller για να μην στέλνει διπλά αιτήματα
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    // 3. Βρες όλα τα αιτήματα (σταλμένα ή ληφθέντα) για έναν χρήστη (προαιρετικό, για ιστορικό)
    List<FriendRequest> findBySenderOrReceiver(User sender, User receiver);
}