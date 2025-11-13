package com.example.saja_saja.service;

import com.example.saja_saja.dto.report.ReviewReportListResponseDto;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.ReviewReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Transactional
@Service
@RequiredArgsConstructor
public class ReviewReportService {
    private final ReviewReportRepository reviewReportRepository;

    public Page<ReviewReportListResponseDto> getReviewReportList(Long userId, Pageable pageable) {
        Page<ReviewReport> reviewReportPage;
        try {
            if (userId != null) {
                reviewReportPage = reviewReportRepository.findAllByReporterId(userId, pageable);
            } else {
                reviewReportPage = reviewReportRepository.findAll(pageable);
            }

            return reviewReportPage.map(ReviewReportListResponseDto::new);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
