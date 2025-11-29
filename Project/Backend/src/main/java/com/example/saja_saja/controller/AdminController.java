package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportProcessRequestDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.service.BuyerService;
import com.example.saja_saja.service.ReportService;
import com.example.saja_saja.service.UserService;
import com.example.saja_saja.service.admin.AdminPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final ReportService reportService;
    private final AdminPostService adminPostService;
    private final BuyerService buyerService;

    @GetMapping("/reports/{type}")
    public ResponseEntity getReportList(
            @PathVariable ReportType type,
            @RequestParam(required = false, defaultValue = "-1") Integer status,
            @PageableDefault(size = 15, sort = "reportedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReportList(member, type, status, pageable);
    }

    @GetMapping("/report/{type}/{reportId}")
    public ResponseEntity getReport(@PathVariable ReportType type, @PathVariable Long reportId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReport(member, type, reportId);
    }

    @PostMapping("/report/{type}/{reportId}")
    public ResponseEntity processReport(
            @PathVariable ReportType type, @PathVariable Long reportId,
            @RequestBody ReportProcessRequestDto req
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.processReport(member, type, reportId, req);
    }

    @GetMapping("/posts")
    public ResponseEntity getAdminPostList(
            @RequestParam(required = false, defaultValue = "-1") Integer process,       // -1: 전체, 0: 대기, 1: 승인, 4: 반려
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminPostService.adminPostList(member, process, pageable);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity processPost(
            @PathVariable Long postId,
            @RequestParam(required = true) Integer process      // 1: 승인, 2: 반려
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminPostService.process(member, postId, process);
    }

    // TODO: 정산 처리
    @GetMapping("/buyers")
    public ResponseEntity getBuyers(@RequestParam(required = false, defaultValue = "-1") Integer process) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
//        return buyerService.getBuyerList(member, process);
        return null;
    }
}
