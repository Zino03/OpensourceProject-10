package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportProcessRequestDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.service.PostService;
import com.example.saja_saja.service.ReportService;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final ReportService reportService;
    private final PostService postService;

    @GetMapping("/admin/reports/{type}")
    public ResponseEntity getReportList(
            @PathVariable ReportType type,
            @RequestParam(required = false, defaultValue = "-1") Integer status,
            @PageableDefault(size = 15, sort = "reportedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReportList(member, type, status, pageable);
    }

    @GetMapping("/admin/report/{type}/{reportId}")
    public ResponseEntity getReport(@PathVariable ReportType type, @PathVariable Long reportId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReport(member, type, reportId);
    }

    @PostMapping("/admin/report/{type}/{reportId}")
    public ResponseEntity processReport(
            @PathVariable ReportType type, @PathVariable Long reportId,
            @RequestBody ReportProcessRequestDto req
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.processReport(member, type, reportId, req);
    }

    // TODO: 게시글 관리
    @GetMapping("/admin/posts")
    public ResponseEntity getAdminPostList(
            @RequestParam(required = false, defaultValue = "-1") Integer process,       // -1: 전체, 0: 대기, 1: 승인, 4: 반려
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.adminPostList(member, process, pageable);
    }

    @PostMapping("/admin/post/{postId}")
    public ResponseEntity processPost(
            @PathVariable Long postId,
            @RequestParam(required = true) Integer process      // 1: 승인, 2: 반려
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.process(member, postId, process);
    }

    // TODO: 정산 처리
}
