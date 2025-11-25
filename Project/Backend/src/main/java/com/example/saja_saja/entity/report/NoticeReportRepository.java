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
}
