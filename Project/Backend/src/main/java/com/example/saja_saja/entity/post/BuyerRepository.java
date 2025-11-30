package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByUser(User user);
    Optional<Buyer> findByUserAndPostAndIsCanceled(User user, Post post, Boolean isCanceled);
    Page<Buyer> findAllByIsPaidIn(List<Integer> isPaids, Pageable pageable);
    Page<Buyer> findAllByIsPaid(Integer isPaid, Pageable pageable);
}
