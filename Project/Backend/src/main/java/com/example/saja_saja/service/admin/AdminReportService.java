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
import com.example.saja_saja.exception.ResourceNotFoundException;
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


    public ResponseEntity getReportList(Member member,
                                        ReportType reportType,
                                        Integer status,
                                        Integer searchType,
                                        String searchQuery,
                                        Pageable pageable) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        try {
            Page<?> reportPage;
            boolean hasSearch = (searchQuery != null && !searchQuery.isBlank());

            switch (reportType) {
                case USER: {
                    if (!hasSearch) {
                        // 🔹 검색어 없음 → 기존 로직 그대로
                        if (status == -1) {
                            reportPage = userReportRepository.findAll(pageable);
                        } else {
                            reportPage = userReportRepository.findAllByStatus(status, pageable);
                        }
                    } else {
                        // 🔹 검색어 있음
                        if (searchType == 0) { // reporter.name
                            if (status == -1) {
                                reportPage = userReportRepository.findAllByReporter_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = userReportRepository.findAllByStatusAndReporter_NameContaining(status, searchQuery, pageable);
                            }
                        } else if (searchType == 1) { // reportedUser.name
                            if (status == -1) {
                                reportPage = userReportRepository.findAllByReportedUser_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = userReportRepository.findAllByStatusAndReportedUser_NameContaining(status, searchQuery, pageable);
                            }
                        } else {
                            throw new BadRequestException("유효하지 않은 searchType입니다.", null);
                        }
                    }
                    break;
                }

                case REVIEW: {
                    if (!hasSearch) {
                        if (status == -1) {
                            reportPage = reviewReportRepository.findAll(pageable);
                        } else {
                            reportPage = reviewReportRepository.findAllByStatus(status, pageable);
                        }
                    } else {
                        if (searchType == 0) { // reporter.name
                            if (status == -1) {
                                reportPage = reviewReportRepository.findAllByReporter_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = reviewReportRepository.findAllByStatusAndReporter_NameContaining(status, searchQuery, pageable);
                            }
                        } else if (searchType == 1) { // reportedReview.buyer.user.name
                            if (status == -1) {
                                reportPage = reviewReportRepository.findAllByReportedReview_Buyer_User_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = reviewReportRepository.findAllByStatusAndReportedReview_Buyer_User_NameContaining(status, searchQuery, pageable);
                            }
                        } else {
                            throw new BadRequestException("유효하지 않은 searchType입니다.", null);
                        }
                    }
                    break;
                }

                case NOTICE: {
                    if (!hasSearch) {
                        if (status == -1) {
                            reportPage = noticeReportRepository.findAll(pageable);
                        } else {
                            reportPage = noticeReportRepository.findAllByStatus(status, pageable);
                        }
                    } else {
                        if (searchType == 0) { // reporter.name
                            if (status == -1) {
                                reportPage = noticeReportRepository.findAllByReporter_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = noticeReportRepository.findAllByStatusAndReporter_NameContaining(status, searchQuery, pageable);
                            }
                        } else if (searchType == 1) { // notice.post.host.name
                            if (status == -1) {
                                reportPage = noticeReportRepository.findAllByReportedNotice_Post_Host_NameContaining(searchQuery, pageable);
                            } else {
                                reportPage = noticeReportRepository.findAllByStatusAndReportedNotice_Post_Host_NameContaining(status, searchQuery, pageable);
                            }
                        } else {
                            throw new BadRequestException("유효하지 않은 searchType입니다.", null);
                        }
                    }
                    break;
                }

                default:
                    throw new BadRequestException("유효하지 않은 신고 타입입니다.", null);
            }

            Page<ReportListResponseDto> reportDtoPage =
                    reportPage.map(ReportListResponseDto::of);

            List<ReportListResponseDto> reports = reportDtoPage.getContent();
            boolean hasMore = reportDtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("reports", reports);
            data.put("hasMore", hasMore);

            return new ResponseEntity<>(data, HttpStatus.OK);

        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage(), null);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 내역을 불러올 수 없습니다.", e);
        }
    }


    @Transactional
    public ResponseEntity processReport(Member member, ReportType type, Long reportId, ReportProcessRequestDto req) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("신고 처리 권한이 없습니다.");
        }

        try {
            ReportResponseDto reportResponse = null;

            switch (type) {
                case USER:
                    UserReport userReport = userReportRepository.findById(reportId)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 내역을 찾을 수 없습니다."));

                    if (userReport.getStatus() != 0) {
                        throw new BadRequestException("대기 중인 신고만 처리할 수 있습니다.", null);
                    }

                    userReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        User user = Optional.ofNullable(userReport.getReportedUser())
                                .orElseThrow(() -> new ResourceNotFoundException("신고된 사용자를 찾을 수 없습니다."));

                        user.setIsBanned(true);
                        user.setTotalStar(0);

                        if (req.getBannedReason().isEmpty()) throw new BadRequestException("사용자 제재 사유를 입력하세요.", null);
                        user.setBannedReason(req.getBannedReason());

                        List<Post> posts = user.getPosts();
                        for (Post post : posts) {
                            postService.cancel(user, post.getId());
                        }
                    }
                    reportResponse = ReportResponseDto.of(userReport);
                    break;
                case REVIEW:
                    ReviewReport reviewReport = reviewReportRepository.findById(reportId)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 내역을 찾을 수 없습니다."));

                    if (reviewReport.getStatus() != 0) {
                        throw new BadRequestException("대기 중인 신고만 처리할 수 있습니다.", null);
                    }

                    reviewReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        Review review = Optional.ofNullable(reviewReport.getReportedReview())
                                .orElseThrow(() -> new ResourceNotFoundException("신고된 리뷰를 찾을 수 없습니다."));

                        review.setIsBanned(true);

                        User host = review.getBuyer().getPost().getHost();
                        host.setTotalStar(host.getTotalStar() - review.getStar());
                        host.setReceivedReviewCount(host.getReceivedReviewCount() - 1);
                    }
                    reportResponse = ReportResponseDto.of(reviewReport);
                    break;
                case NOTICE:
                    NoticeReport noticeReport = noticeReportRepository.findById(reportId)
                            .orElseThrow(() -> new ResourceNotFoundException("신고 내역을 찾을 수 없습니다."));

                    if (noticeReport.getStatus() != 0) {
                        throw new BadRequestException("대기 중인 신고만 처리할 수 있습니다.", null);
                    }

                    noticeReport.setStatus(req.getStatus());
                    if (req.getStatus() == 2) {
                        Notice notice = Optional.ofNullable(noticeReport.getReportedNotice())
                                .orElseThrow(() -> new ResourceNotFoundException("신고된 공지를 찾을 수 없습니다."));

                        notice.setIsBanned(true);
                    }
                    reportResponse = ReportResponseDto.of(noticeReport);
                    break;
                default:
                    throw new BadRequestException("유효하지 않은 신고 유형입니다.", null);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("message", "신고 처리가 완료되었습니다.");
            data.put("report", reportResponse);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("신고 처리에 실패하였습니다.", e);
        }
    }
}
