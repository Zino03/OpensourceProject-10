package com.example.saja_saja.entity.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Optional<Post> findById(Long id);

    @Query("SELECT p FROM Post p JOIN FETCH p.host WHERE p.status = :status")
    Page<Post> findAllByStatus(@Param("status") Integer status, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN FETCH p.host WHERE p.status IN :statuses")
    Page<Post> findAllByStatusIn(
            @Param("statuses") List<Integer> statuses, // 💡 List 타입으로 변경
            Pageable pageable
    );
}
