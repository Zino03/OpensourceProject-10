package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
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

    // TODO: 신고 처리
    // TODO: 게시글 관리
    // TODO: 정산 처리
}
