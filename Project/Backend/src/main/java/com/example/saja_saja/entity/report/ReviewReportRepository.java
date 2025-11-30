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

    @Query("SELECT r FROM ReviewReport r JOIN FETCH r.reportedReview JOIN FETCH r.reporter " +
            "WHERE r.reporter.id = :userId AND r.status = :status")
    Page<ReviewReport> findAllByReporterIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") Integer status,
            Pageable pageable
    );

    @Query("SELECT r FROM ReviewReport r JOIN FETCH r.reportedReview JOIN FETCH r.reporter " +
            "WHERE r.status = :status")
    Page<ReviewReport> findAllByStatus(
            @Param("status") Integer status,
            Pageable pageable
    );

    // 🔍 reporter.name 검색
    Page<ReviewReport> findAllByReporter_NameContaining(String name, Pageable pageable);
    Page<ReviewReport> findAllByStatusAndReporter_NameContaining(Integer status, String name, Pageable pageable);

    // 🔍 신고 대상 리뷰 작성자 이름 검색 (review.buyer.user.name)
    Page<ReviewReport> findAllByReportedReview_Buyer_User_NameContaining(String name, Pageable pageable);
    Page<ReviewReport> findAllByStatusAndReportedReview_Buyer_User_NameContaining(Integer status, String name, Pageable pageable);
}
