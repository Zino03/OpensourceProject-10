package com.example.saja_saja.dto.report;

import com.example.saja_saja.entity.report.NoticeReport;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.UserReport;
import com.example.saja_saja.exception.BadRequestException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponseDto {
    private Long id;

    private String reporterNickname;

    private String reportedNickname;

    private String title;

    private String content;

    private LocalDateTime reportedAt;

    // 0: 처리 대기, 1: 신고 기각, 2: 사용자 제재
    private Integer status;

    private String BannedReason;

    public static ReportResponseDto of(Object reportEntity) {
        if (reportEntity instanceof ReviewReport reviewReport) {
            return new ReportResponseDto(
                    reviewReport.getId(),
                    reviewReport.getReporter().getNickname(),
                    reviewReport.getReportedReview().getBuyer().getUser().getNickname(),
                    reviewReport.getTitle(),
                    reviewReport.getContent(),
                    reviewReport.getReportedAt(),
                    reviewReport.getStatus(),
                    null
            );
        } else if (reportEntity instanceof UserReport userReport) {
            return new ReportResponseDto(
                    userReport.getId(),
                    userReport.getReporter().getNickname(),
                    userReport.getReportedUser().getNickname(),
                    userReport.getTitle(),
                    userReport.getContent(),
                    userReport.getReportedAt(),
                    userReport.getStatus(),
                    userReport.getReportedUser().getBannedReason()
            );
        } else if (reportEntity instanceof NoticeReport noticeReport) {
            return new ReportResponseDto(
                    noticeReport.getId(),
                    noticeReport.getReporter().getNickname(),
                    noticeReport.getReportedNotice().getPost().getHost().getNickname(),
                    noticeReport.getTitle(),
                    noticeReport.getContent(),
                    noticeReport.getReportedAt(),
                    noticeReport.getStatus(),
                    null
            );
        }

        throw new BadRequestException("지원하지 않는 Report Entity 타입입니다.", null);
    }
}
