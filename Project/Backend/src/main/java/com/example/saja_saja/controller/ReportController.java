package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportRequestDto;
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
public class ReportController {
    private final UserService userService;
    private final ReportService reportService;

    @GetMapping("/reports/{type}")
    public ResponseEntity getReviewReportList(
            @PathVariable ReportType type,
            @PageableDefault(size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReportList(member, type, pageable);
    }

//    @GetMapping("/reports/{type}/{reportId}")
//    public ResponseEntity getReport(@PathVariable ReportType type, @PathVariable Long reportId) {
//        return reportService.getReport(type, reportId);
//    }

    @PostMapping("/report/{type}")
    public ResponseEntity createReport(@PathVariable ReportType type, @RequestBody ReportRequestDto req) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.createReport(member, type, req);
    }

    @DeleteMapping("/report/{type}/{reportId}")
    public ResponseEntity deleteReport(@PathVariable ReportType type, @PathVariable Long reportId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.deleteReport(member, type, reportId);
    }
}
