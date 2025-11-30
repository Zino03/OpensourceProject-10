package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByUser(User user);
    Optional<Buyer> findByUserAndPostAndIsCanceled(User user, Post post, Boolean isCanceled);
}
