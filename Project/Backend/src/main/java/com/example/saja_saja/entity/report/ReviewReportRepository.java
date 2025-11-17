package com.example.saja_saja.entity.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {
    @Query("SELECT r FROM ReviewReport r JOIN FETCH r.reportedReview WHERE r.reporter.id = :reporterId")
    Page<ReviewReport> findAllByReporterId(@Param("reporterId") Long reporterId, Pageable pageable);

    @Query("SELECT r FROM ReviewReport r JOIN FETCH r.reportedReview")
    Page<ReviewReport> findAll(Pageable pageable);
}
