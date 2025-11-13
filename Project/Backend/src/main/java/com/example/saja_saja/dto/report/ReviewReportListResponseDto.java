package com.example.saja_saja.dto.report;

import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.report.ReviewReport;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewReportListResponseDto {
    private Long id;

    private Review reportedReview;

    private String content;

    public ReviewReportListResponseDto(ReviewReport reviewReport) {
        this.id = reviewReport.getId();
        this.reportedReview = reviewReport.getReportedReview();
        this.content = reviewReport.getContent();
    }
}
