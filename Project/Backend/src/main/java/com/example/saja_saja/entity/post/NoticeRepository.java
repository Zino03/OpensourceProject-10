package com.example.saja_saja.entity.post;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Optional<Notice> findByIdAndPost(Long noticeId, Post post);
}
