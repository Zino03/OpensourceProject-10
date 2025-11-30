package com.example.saja_saja.service;

import com.example.saja_saja.dto.report.*;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Notice;
import com.example.saja_saja.entity.post.NoticeRepository;
import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.post.ReviewRepository;
import com.example.saja_saja.entity.report.*;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserRepository;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

import static com.example.saja_saja.dto.report.ReportType.USER;


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

    // TODO: 제재를 당했을때 진행중 공구 취소, 참여중인 공구는 취소 X
    //  제재된 사용자 프로필에는 제재여부, 매너점수 초기화, 공구 조회 X
    //  제재된 사용자 본인의 경우 본인 프로필에서 공구 조회 X, 주문내역 확인 O, 정보 수정 O, 배송지 관리 O,
    //  post 공구 등록, 구매, 후기 모든 서비스 불가능

    @Transactional
    public ResponseEntity createReport(Member member, ReportType type, ReportRequestDto req) {
        try {
            User reporter = member.getUser();
            if (reporter.getIsBanned()) {
                throw new AccessDeniedException("이용이 정지된 사용자입니다.");
            }

            Long reportedId = req.getReportedId();
            String reportedNickname = req.getReportedNickname();
            String title = req.getTitle();
            String content = req.getContent();

            Object reportEntity = null;

            switch (type) {
                case USER:
                    if (reportedNickname == null) {
                        throw new IllegalArgumentException("신고 대상 닉네임은 필수 항목입니다.");
                    }

                    User reportedUser = userRepository.findByNickname(reportedNickname)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 대상 사용자를 찾을 수 없습니다."));

                    if (reportedUser.getIsBanned()) {
                        throw new IllegalArgumentException("이미 이용이 정지된 사용자입니다.");
                    }

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
                case REVIEW:
                    if (reportedId == null) {
                        throw new IllegalArgumentException("신고 대상 ID는 필수 항목입니다.");
                    }

                    Review reportedReview = reviewRepository.findById(reportedId)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 대상 후기를 찾을 수 없습니다."));

                    if (reportedReview.getIsBanned()) {
                        throw new IllegalArgumentException("이미 제재된 후기입니다.");
                    }

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
                case NOTICE:
                    if (reportedId == null) {
                        throw new IllegalArgumentException("신고 대상 ID는 필수 항목입니다.");
                    }

                    Notice reportedNotice = noticeRepository.findById(reportedId)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 대상 공지를 찾을 수 없습니다."));

                    if (reportedNotice.getIsBanned()) {
                        throw new IllegalArgumentException("이미 제재된 공지입니다.");
                    }

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

            ReportResponseDto reportDto = ReportResponseDto.of(reportEntity);

            HashMap<String, Object> data = new HashMap<>();
            data.put("report", reportDto);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(e.getMessage(), req);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고를 실패하였습니다..");
        }
    }
}
