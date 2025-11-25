package com.example.saja_saja.service;

import com.example.saja_saja.dto.report.ReportListResponseDto;
import com.example.saja_saja.dto.report.ReportRequestDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Notice;
import com.example.saja_saja.entity.post.NoticeRepository;
import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.post.ReviewRepository;
import com.example.saja_saja.entity.report.*;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
import com.example.saja_saja.entity.user.UserRepository;
import com.example.saja_saja.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;


@Transactional
@Service
@RequiredArgsConstructor
public class ReportService {
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final NoticeRepository noticeRepository;
    private final UserReportRepository userReportRepository;
    private final ReviewReportRepository reviewReportRepository;
    private final NoticeReportRepository noticeReportRepository;

    public ResponseEntity getReportList(Member member, ReportType reportType, Pageable pageable) {
        try {
            Page<?> reportPage;
            Long userId = (member.getRole() == Role.USER) ? member.getUser().getId() : null;

            switch (reportType) {
                case REVIEW:
                    reportPage = (userId != null)
                            ? reviewReportRepository.findAllByReporterId(userId, pageable)
                            : reviewReportRepository.findAll(pageable);
                    break;

                case USER:
                    reportPage = (userId != null)
                            ? userReportRepository.findAllByReporterId(userId, pageable)
                            : userReportRepository.findAll(pageable);
                    break;

                case NOTICE:
                    reportPage = (userId != null)
                            ? noticeReportRepository.findAllByReporterId(userId, pageable)
                            : noticeReportRepository.findAll(pageable);
                    break;

                default:
                    return new ResponseEntity<>(
                            new HashMap<>() {{ put("message", "유효하지 않은 신고 타입입니다."); }},
                            HttpStatus.BAD_REQUEST
                    );
            }

            Page<ReportListResponseDto> reportDtoPage = reportPage.map(
                    reportEntity -> ReportListResponseDto.from(reportEntity)
            );

            List<ReportListResponseDto> reports = reportDtoPage.getContent();
            boolean hasMore = reportDtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("reports", reports);
            data.put("hasMore", hasMore);

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 내역을 불러올 수 없습니다.");
        }
    }

//    public ResponseEntity getReport(ReportType type, Long reportId) {
//        try {
//            switch (type) {
//                case REVIEW:
//                    ReviewReport reviewReport = reviewReportRepository.findById(reportId)
//                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));
//
//            }
//        } catch (Exception e){
//            e.printStackTrace();
//            throw new RuntimeException("신고 내역을 불러올 수 없습니다.");
//        }
//    }

    @Transactional
    public ResponseEntity createReport(Member member, ReportType type, ReportRequestDto req) {
        try {
            User reporter = member.getUser();

            Long reportedId = req.getReportedId();
            String title = req.getTitle();
            String content = req.getContent();

            Object reportEntity = null;

            switch (type) {
                case REVIEW:
                    Review reportedReview = reviewRepository.findById(reportedId)
                            .orElseThrow(() -> new NoSuchElementException("신고 대상 리뷰를 찾을 수 없습니다."));

                    ReviewReport reviewReport = ReviewReport.builder()
                            .reportedReview(reportedReview)
                            .reporter(reporter)
                            .title(title)
                            .content(content)
                            .reportedAt(LocalDateTime.now())
                            .status(0)
                            .build();
                    reportEntity = reviewReportRepository.save(reviewReport);
                    break;

                case USER:
                    User reportedUser = userRepository.findById(reportedId)
                            .orElseThrow(() -> new NoSuchElementException("신고 대상 사용자를 찾을 수 없습니다."));

                    UserReport userReport = UserReport.builder()
                            .reportedUser(reportedUser)
                            .reporter(reporter)
                            .title(title)
                            .content(content)
                            .reportedAt(LocalDateTime.now())
                            .status(0)
                            .build();
                    reportEntity = userReportRepository.save(userReport);
                    break;

                case NOTICE:
                    Notice reportedNotice = noticeRepository.findById(reportedId)
                            .orElseThrow(() -> new NoSuchElementException("신고 대상 공지사항을 찾을 수 없습니다."));

                    NoticeReport noticeReport = NoticeReport.builder()
                            .reportedNotice(reportedNotice)
                            .reporter(reporter)
                            .title(title)
                            .content(content)
                            .reportedAt(LocalDateTime.now())
                            .status(0)
                            .build();
                    reportEntity = noticeReportRepository.save(noticeReport);
                    break;

                default:
                    throw new IllegalArgumentException("유효하지 않은 신고 타입입니다.");
            }


            HashMap<String, Object> data = new HashMap<>();
            data.put("data", reportEntity);

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            throw new BadRequestException(e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage(), e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 처리 중 예상치 못한 오류가 발생했습니다.");
        }
    }

    @Transactional
    public ResponseEntity deleteReport(Member member, ReportType type, Long reportId) {
        try {
            switch (type) {
                case REVIEW:
                    ReviewReport reviewReport = reviewReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));
                    reviewReportRepository.delete(reviewReport);
                    break;
                case USER:
                    UserReport userReport = userReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));
                    userReportRepository.delete(userReport);
                    break;
                case NOTICE:
                    NoticeReport noticeReport = noticeReportRepository.findById(reportId)
                            .orElseThrow(() -> new NoSuchElementException("신고 내역을 찾을 수 없습니다."));
                    noticeReportRepository.delete(noticeReport);
                    break;
                default:
                    throw new IllegalArgumentException("유효하지 않은 신고 유형입니다.");
            }

            Map<String, Object> message = new HashMap<>();
            message.put("message", "신고내역이 삭제되었습니다.");
            return new ResponseEntity(message, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고내역 삭제에 실패하였습니다.");
        }
    }
}
