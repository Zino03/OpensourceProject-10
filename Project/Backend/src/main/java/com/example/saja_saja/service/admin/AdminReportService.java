package com.example.saja_saja.service.admin;

import com.example.saja_saja.dto.report.ReportListResponseDto;
import com.example.saja_saja.dto.report.ReportProcessRequestDto;
import com.example.saja_saja.dto.report.ReportResponseDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Notice;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.report.*;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminReportService {
    private final UserReportRepository userReportRepository;
    private final ReviewReportRepository reviewReportRepository;
    private final NoticeReportRepository noticeReportRepository;
    private final PostService postService;


    public ResponseEntity getReportList(Member member, ReportType reportType, Integer status, Pageable pageable) {
        try {
            if (member.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("관리자 권한이 없습니다.");
            }

            Page<?> reportPage;

            switch (reportType) {
                case USER:
                    if (status == -1) {
                        reportPage = userReportRepository.findAll(pageable);
                    } else {
                        reportPage = userReportRepository.findAllByStatus(status, pageable);
                    }
                    break;
                case REVIEW:
                    if (status == -1) {
                        reportPage = reviewReportRepository.findAll(pageable);
                    } else {
                        reportPage = reviewReportRepository.findAllByStatus(status, pageable);
                    }
                    break;
                case NOTICE:
                    if (status == -1) {
                        reportPage = noticeReportRepository.findAll(pageable);
                    } else {
                        reportPage = noticeReportRepository.findAllByStatus(status, pageable);
                    }
                    break;
                default:
                    throw new IllegalArgumentException("유효하지 않은 신고 타입입니다.");
            }

            Page<ReportListResponseDto> reportDtoPage = reportPage.map(
                    reportEntity -> ReportListResponseDto.of(reportEntity)
            );

            List<ReportListResponseDto> reports = reportDtoPage.getContent();
            boolean hasMore = reportDtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("reports", reports);
            data.put("hasMore", hasMore);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 내역을 불러올 수 없습니다.", e);
        }
    }

    @Transactional
    public ResponseEntity processReport(Member member, ReportType type, Long reportId, ReportProcessRequestDto req) {
        try {
            if (member.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("신고 처리 권한이 없습니다.");
            }

            ReportResponseDto reportResponse = null;

            switch (type) {
                case USER:
                    UserReport userReport = userReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));

                    if (userReport.getStatus() != 0) {
                        throw new IllegalArgumentException("대기 중인 신고만 처리할 수 있습니다.");
                    }

                    userReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        User user = Optional.ofNullable(userReport.getReportedUser())
                                .orElseThrow(() -> new NoSuchElementException("신고된 사용자를 찾을 수 없습니다."));

                        user.setIsBanned(true);
                        user.setBannedReason(req.getBannedReason());
                        user.setMannerScore(0.0);

                        List<Post> posts = user.getPosts();
                        for (Post post : posts) {
                            // TODO: member -> user
                            postService.cancel(new Member("","",user, Role.USER), post.getId());
                        }
                    }
                    reportResponse = ReportResponseDto.of(userReport);
                    break;
                case REVIEW:
                    ReviewReport reviewReport = reviewReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));

                    if (reviewReport.getStatus() != 0) {
                        throw new IllegalArgumentException("대기 중인 신고만 처리할 수 있습니다.");
                    }

                    reviewReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        Review review = Optional.ofNullable(reviewReport.getReportedReview())
                                .orElseThrow(() -> new NoSuchElementException("신고된 리뷰를 찾을 수 없습니다."));

                        review.setIsBanned(true);
                    }
                    reportResponse = ReportResponseDto.of(reviewReport);
                    break;
                case NOTICE:
                    NoticeReport noticeReport = noticeReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));

                    if (noticeReport.getStatus() != 0) {
                        throw new IllegalArgumentException("대기 중인 신고만 처리할 수 있습니다.");
                    }

                    noticeReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        Notice notice = Optional.ofNullable(noticeReport.getReportedNotice())
                                .orElseThrow(() -> new NoSuchElementException("신고된 공지를 찾을 수 없습니다."));

                        notice.setIsBanned(true);
                    }
                    reportResponse = ReportResponseDto.of(noticeReport);
                    break;
                default:
                    throw new IllegalArgumentException("유효하지 않은 신고 유형입니다.");
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("message", "신고 처리가 완료되었습니다.");
            data.put("report", reportResponse);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            e.printStackTrace();
            throw new BadRequestException(e.getMessage(), null);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage(), null);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 처리에 실패하였습니다.", e);
        }
    }
}
