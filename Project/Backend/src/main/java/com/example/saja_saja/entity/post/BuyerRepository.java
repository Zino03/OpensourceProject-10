package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Buyer findByUser(User user);
}
