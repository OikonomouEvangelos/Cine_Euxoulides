package com.CineEuxoulides.Euxoulides.domain;

import jakarta.persistence.*;

// Entity = πίνακας στη βάση
@Entity
@Table(name = "users")   // Θα δημιουργηθεί πίνακας "users" στη PostgreSQL
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment id
    private Long id;

    // Όνομα
    private String firstName;

    // Επώνυμο
    private String lastName;

    // Email (μοναδικό)
    @Column(unique = true, nullable = false)
    private String email;

    // Κωδικός (προς το παρόν απλό string, αργότερα θα γίνει hashed)
    @Column(nullable = false)
    private String password;

    // ====== Getters & Setters ======

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
