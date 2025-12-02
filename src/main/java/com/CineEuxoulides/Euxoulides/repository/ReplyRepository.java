package com.CineEuxoulides.Euxoulides.repository;

import com.CineEuxoulides.Euxoulides.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
    // Basic CRUD operations are handled automatically by JpaRepository
}