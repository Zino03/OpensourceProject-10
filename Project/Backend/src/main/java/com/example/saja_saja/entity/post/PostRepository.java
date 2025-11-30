package com.example.saja_saja.entity.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {

    @Query(value = """
        SELECT p.*
        FROM post p
        JOIN address a ON p.pickup_address_id = a.id
        WHERE p.is_canceled = false
        ORDER BY
            (6371 * ACOS(
                COS(RADIANS(:lat)) * COS(RADIANS(a.latitude)) *
                COS(RADIANS(a.longitude) - RADIANS(:lon)) +
                SIN(RADIANS(:lat)) * SIN(RADIANS(a.latitude))
            )) ASC
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM post p
        JOIN address a ON p.pickup_address_id = a.id
        WHERE p.is_canceled = false
        """,
            nativeQuery = true)
    Page<Post> findNearPosts(
            @Param("lat") double lat,
            @Param("lon") double lon,
            Pageable pageable
    );
    Optional<Post> findById(Long id);

    @Query("SELECT p FROM Post p JOIN FETCH p.host WHERE p.status = :status")
    Page<Post> findAllByStatus(@Param("status") Integer status, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN FETCH p.host WHERE p.status IN :statuses")
    Page<Post> findAllByStatusIn(
            @Param("statuses") List<Integer> statuses, // 💡 List 타입으로 변경
            Pageable pageable
    );
}
