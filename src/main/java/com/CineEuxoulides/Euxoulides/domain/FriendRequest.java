package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "friend_requests")
public class FriendRequest {

    // Getters and Setters...
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Setter
    @Getter
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Setter
    @Getter
    private String status; // "PENDING", "ACCEPTED", "REJECTED"
    private LocalDateTime createdAt;

    public FriendRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

}