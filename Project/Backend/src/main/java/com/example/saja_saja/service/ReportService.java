package com.example.saja_saja.service;

import com.example.saja_saja.dto.report.ReviewReportListResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.ReviewReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;


@Transactional
@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReviewReportRepository reviewReportRepository;

    public ResponseEntity getReviewReportList(Member member, Pageable pageable) {
        try {
            Page<ReviewReport> reviewReportPage;
            if (member.getRole() == Role.USER) {
                Long userId = member.getUser().getId();
                System.out.println(userId);
                reviewReportPage = reviewReportRepository.findAllByReporterId(userId, pageable);
            } else {
                reviewReportPage = reviewReportRepository.findAll(pageable);
            }
            Page<ReviewReportListResponseDto> reportDtoPage = reviewReportPage.map(ReviewReportListResponseDto::new);

            List<ReviewReportListResponseDto> reports = reportDtoPage.getContent();
            boolean hasMore = reportDtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("reports", reports);
            data.put("hasMore", hasMore);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 내역을 불러올 수 없습니다.");
        }
    }
}
