package com.example.saja_saja.entity.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    @Query("SELECT r FROM UserReport r JOIN FETCH r.reportedUser WHERE r.reporter.id = :reporterId")
    Page<UserReport> findAllByReporterId(@Param("reporterId") Long reporterId, Pageable pageable);

    @Query("SELECT r FROM UserReport r JOIN FETCH r.reportedUser")
    Page<UserReport> findAll(Pageable pageable);

    @Query("SELECT r FROM UserReport r JOIN FETCH r.reportedUser JOIN FETCH r.reporter " +
            "WHERE r.reporter.id = :userId AND r.status = :status")
    Page<UserReport> findAllByReporterIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") Integer status,
            Pageable pageable
    );

    @Query("SELECT r FROM UserReport r JOIN FETCH r.reportedUser JOIN FETCH r.reporter " +
            "WHERE r.status = :status")
    Page<UserReport> findAllByStatus(
            @Param("status") Integer status,
            Pageable pageable
    );
}
