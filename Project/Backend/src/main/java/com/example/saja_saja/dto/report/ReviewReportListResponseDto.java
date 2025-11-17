package com.example.saja_saja.dto.report;

import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewReportListResponseDto {
    private Long id;

    private String reporterNickname;

    private Review reportedReview;

    private String content;

    public ReviewReportListResponseDto(ReviewReport reviewReport) {
        this.id = reviewReport.getId();
        this.reporterNickname = reviewReport.getReporter().getNickname();
        this.reportedReview = reviewReport.getReportedReview();
        this.content = reviewReport.getContent();
    }
}
