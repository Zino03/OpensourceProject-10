package com.example.saja_saja.dto.report;

import com.example.saja_saja.entity.report.NoticeReport;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.UserReport;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReportListResponseDto {
    private Long id;

    private String reporterNickname;

    private String title;

    private String content;

    private String reportedNickname;

    private LocalDateTime reportedAt;

    // 0: 처리 대기, 1: 신고 기각, 2: 사용자 제재
    private Integer status;

    private String BannedReason;

    public static ReportListResponseDto of(Object reportEntity) {
        if (reportEntity instanceof ReviewReport reviewReport) {
            return new ReportListResponseDto(
                reviewReport.getId(),
                reviewReport.getReporter().getNickname(),
                reviewReport.getTitle(),
                reviewReport.getContent(),
                reviewReport.getReportedReview().getBuyer().getUser().getNickname(),
                reviewReport.getReportedAt(),
                reviewReport.getStatus(),
                    null
            );
        } else if (reportEntity instanceof UserReport userReport) {
            return new ReportListResponseDto(
                userReport.getId(),
                userReport.getReporter().getNickname(),
                userReport.getTitle(),
                userReport.getContent(),
                userReport.getReportedUser().getNickname(),
                userReport.getReportedAt(),
                userReport.getStatus(),
                userReport.getReportedUser().getBannedReason()
            );
        } else if (reportEntity instanceof NoticeReport noticeReport) {
        return new ReportListResponseDto(
                noticeReport.getId(),
                noticeReport.getReporter().getNickname(),
                noticeReport.getTitle(),
                noticeReport.getContent(),
                noticeReport.getReportedNotice().getPost().getHost().getNickname(),
                noticeReport.getReportedAt(),
                noticeReport.getStatus(),
                null
            );
        }

        throw new IllegalArgumentException("지원하지 않는 Report Entity 타입입니다.");
    }
}
