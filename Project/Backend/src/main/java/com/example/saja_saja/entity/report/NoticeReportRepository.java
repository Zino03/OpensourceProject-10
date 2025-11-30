package com.example.saja_saja.entity.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeReportRepository extends JpaRepository<NoticeReport, Long> {
    @Query("SELECT r FROM NoticeReport r JOIN FETCH r.reportedNotice WHERE r.reporter.id = :reporterId")
    Page<NoticeReport> findAllByReporterId(@Param("reporterId") Long reporterId, Pageable pageable);

    @Query("SELECT r FROM NoticeReport r JOIN FETCH r.reportedNotice")
    Page<NoticeReport> findAll(Pageable pageable);

    @Query("SELECT r FROM NoticeReport r JOIN FETCH r.reportedNotice JOIN FETCH r.reporter " +
            "WHERE r.reporter.id = :userId AND r.status = :status")
    Page<ReviewReport> findAllByReporterIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") Integer status,
            Pageable pageable
    );

    @Query("SELECT r FROM NoticeReport r JOIN FETCH r.reportedNotice JOIN FETCH r.reporter " +
            "WHERE r.status = :status")
    Page<ReviewReport> findAllByStatus(
            @Param("status") Integer status,
            Pageable pageable
    );

    // reporter.name 검색
    Page<NoticeReport> findAllByReporter_NameContaining(String name, Pageable pageable);
    Page<NoticeReport> findAllByStatusAndReporter_NameContaining(Integer status, String name, Pageable pageable);

    // 🔥 신고 대상 공구 주최자 이름 검색
    // => NoticeReport.notice.post.host.name 기준
//    Page<NoticeReport> findAllByNotice_Post_Host_NameContaining(String name, Pageable pageable);
//    Page<NoticeReport> findAllByStatusAndNotice_Post_Host_NameContaining(Integer status, String name, Pageable pageable);
    Page<NoticeReport> findAllByReportedNotice_Post_Host_NameContaining(String name, Pageable pageable);
    Page<NoticeReport> findAllByStatusAndReportedNotice_Post_Host_NameContaining(Integer status, String name, Pageable pageable);
}