package com.example.saja_saja.entity.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByPhone(String phone);
    boolean existsByNickname(String nickname);

    Optional<User> findByNickname(String nickname);
    Optional<User> findByPhone(String phone);
}
