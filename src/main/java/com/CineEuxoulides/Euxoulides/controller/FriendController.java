package com.CineEuxoulides.Euxoulides.controller;

import com.CineEuxoulides.Euxoulides.domain.FriendRequest;
import com.CineEuxoulides.Euxoulides.domain.User;
import com.CineEuxoulides.Euxoulides.repository.FriendRequestRepository;
import com.CineEuxoulides.Euxoulides.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin("*")
public class FriendController {

    private final UserRepository userRepository;
    private final FriendRequestRepository requestRepository;

    public FriendController(UserRepository userRepository, FriendRequestRepository requestRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
    }

    // 1. ΑΠΟΣΤΟΛΗ ΑΙΤΗΜΑΤΟΣ
    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(@RequestParam Long senderId, @RequestParam String receiverEmail) {
        Optional<User> senderOpt = userRepository.findById(senderId);
        Optional<User> receiverOpt = userRepository.findByEmail(receiverEmail);

        if (senderOpt.isEmpty() || receiverOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Χρήστης δεν βρέθηκε.");
        }

        User sender = senderOpt.get();
        User receiver = receiverOpt.get();

        if (sender.getId().equals(receiver.getId())) {
            return ResponseEntity.badRequest().body("Δεν μπορείς να κάνεις φίλο τον εαυτό σου!");
        }

        // Έλεγχος αν είναι ήδη φίλοι (Απλοϊκός έλεγχος)
        if (sender.getFriends().contains(receiver)) {
            return ResponseEntity.badRequest().body("Είστε ήδη φίλοι.");
        }

        FriendRequest req = new FriendRequest();
        req.setSender(sender);
        req.setReceiver(receiver);
        req.setStatus("PENDING");

        requestRepository.save(req);
        return ResponseEntity.ok("Το αίτημα στάλθηκε!");
    }

    // 2. ΛΗΨΗ ΕΚΚΡΕΜΩΝ ΑΙΤΗΜΑΤΩΝ (PENDING)
    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests(@RequestParam Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();

        User receiver = userOpt.get();
        // Βρες τα αιτήματα που έχουν έρθει σε εμένα και είναι PENDING
        List<FriendRequest> requests = requestRepository.findByReceiverAndStatus(receiver, "PENDING");

        // Μετατροπή σε απλή μορφή JSON για να μην μπλέκεται το frontend
        List<Map<String, Object>> response = requests.stream().map(req -> {
            Map<String, Object> map = new HashMap<>();
            map.put("requestId", req.getId());
            map.put("senderName", req.getSender().getFirstName() + " " + req.getSender().getLastName());
            map.put("senderEmail", req.getSender().getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // 3. ΑΠΟΔΟΧΗ ΑΙΤΗΜΑΤΟΣ
    @PostMapping("/accept")
    public ResponseEntity<?> acceptRequest(@RequestParam Long requestId) {
        Optional<FriendRequest> reqOpt = requestRepository.findById(requestId);
        if (reqOpt.isEmpty()) return ResponseEntity.badRequest().body("Το αίτημα δεν βρέθηκε.");

        FriendRequest req = reqOpt.get();
        req.setStatus("ACCEPTED");
        requestRepository.save(req);

        // Προσθήκη στη λίστα φίλων και των δύο
        User sender = req.getSender();
        User receiver = req.getReceiver();

        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);

        userRepository.save(sender);
        userRepository.save(receiver);

        return ResponseEntity.ok("Το αίτημα έγινε δεκτό!");
    }

    // 4. ΑΠΟΡΡΙΨΗ ΑΙΤΗΜΑΤΟΣ
    @PostMapping("/reject")
    public ResponseEntity<?> rejectRequest(@RequestParam Long requestId) {
        requestRepository.deleteById(requestId);
        return ResponseEntity.ok("Το αίτημα απορρίφθηκε.");
    }

    // 5. ΛΙΣΤΑ ΦΙΛΩΝ
    @GetMapping("/list")
    public ResponseEntity<?> getFriendsList(@RequestParam Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();

        Set<User> friends = userOpt.get().getFriends();

        // Μετατροπή σε απλή λίστα για το Frontend
        List<Map<String, Object>> response = friends.stream().map(f -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("firstName", f.getFirstName());
            map.put("lastName", f.getLastName());
            map.put("email", f.getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}