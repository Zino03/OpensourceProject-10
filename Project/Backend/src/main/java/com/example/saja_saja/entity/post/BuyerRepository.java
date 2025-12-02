package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByUser(User user);
    Optional<Buyer> findByUserAndPostAndIsCanceled(User user, Post post, Boolean isCanceled);
    Page<Buyer> findAllByIsPaidIn(List<Integer> isPaids, Pageable pageable);
    Page<Buyer> findAllByIsPaid(Integer isPaid, Pageable pageable);

    @Query("SELECT b FROM Buyer b " +
            "WHERE b.user = :user " +
            "AND b.status IN :statuses " +
            "AND b.post.host != :user")
    Page<Buyer> findAllByUserAndStatusInAndPostHostNot(@Param("user") User user, @Param("statuses") List<Integer> statuses, Pageable pageable);
    @Query("SELECT b FROM Buyer b " +
            "WHERE b.user = :user " +
            "AND b.status = :status " +
            "AND b.post.host != :user")
    Page<Buyer> findAllByUserAndStatusAndPostHostNot(@Param("user") User user, @Param("status") Integer status, Pageable pageable);

    Page<Buyer> findAllByPayerNameContaining(String payerName, Pageable pageable);
    Page<Buyer> findAllByIsPaidInAndPayerNameContaining(List<Integer> isPaidList, String payerName, Pageable pageable);
    Page<Buyer> findAllByIsPaidAndPayerNameContaining(Integer isPaid, String payerName, Pageable pageable);


    @Query("SELECT b.status, COUNT(b) FROM Buyer b WHERE b.user = :user GROUP BY b.status")
    List<Object[]> countOrderStatusByUser(@Param("user") User user);

    @Query("SELECT b FROM Buyer b WHERE b.status = 4 AND b.isCanceled = false AND b.receivedAt < :sevenDaysAgo")
    List<Buyer> findAllForAutoConfirm(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);

    @Query("SELECT b.status, COUNT(b) FROM Buyer b " +
            "JOIN b.post p " +
            "WHERE b.user = :user AND p.host != :user " +
            "GROUP BY b.status")
    List<Object[]> countOrderStatusByUserAndPostHostNot(@Param("user") User user);


    Optional<Buyer> findFirstByPostAndIsCanceledAndIsPaidOrderByIdDesc(Post post, Boolean isCanceled, Integer isPaid);
}
