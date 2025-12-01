package com.example.saja_saja.dto.report;

import com.example.saja_saja.entity.report.NoticeReport;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.UserReport;
import com.example.saja_saja.exception.BadRequestException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
            return ReportResponseDto.builder()
                    .id(reviewReport.getId())
                    .reporterNickname(reviewReport.getReporter().getNickname())
                    .reportedNickname(reviewReport.getReportedReview().getBuyer().getUser().getNickname())
                    .title(reviewReport.getTitle())
                    .content(reviewReport.getContent())
                    .reportedAt(reviewReport.getReportedAt())
                    .status(reviewReport.getStatus())
                    .build();
        } else if (reportEntity instanceof UserReport userReport) {
            return ReportResponseDto.builder()
                    .id(userReport.getId())
                    .reporterNickname(userReport.getReporter().getNickname())
                    .reportedNickname(userReport.getReportedUser().getNickname())
                    .title(userReport.getTitle())
                    .content(userReport.getContent())
                    .reportedAt(userReport.getReportedAt())
                    .status(userReport.getStatus())
                    .BannedReason(userReport.getReportedUser().getBannedReason())
                    .build();
        } else if (reportEntity instanceof NoticeReport noticeReport) {
            return ReportResponseDto.builder()
                    .id(noticeReport.getId())
                    .reporterNickname(noticeReport.getReporter().getNickname())
                    .reportedNickname(noticeReport.getReportedNotice().getPost().getHost().getNickname())
                    .title(noticeReport.getTitle())
                    .content(noticeReport.getContent())
                    .reportedAt(noticeReport.getReportedAt())
                    .status(noticeReport.getStatus())
                    .build();
        }

        throw new BadRequestException("지원하지 않는 Report Entity 타입입니다.", null);
    }
}
