package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportProcessRequestDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.service.UserService;
import com.example.saja_saja.service.admin.AdminBuyerService;
import com.example.saja_saja.service.admin.AdminPostService;
import com.example.saja_saja.service.admin.AdminReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final AdminPostService adminPostService;
    private final AdminReportService adminReportService;
    private final AdminBuyerService adminBuyerService;

    // TODO: 검색기능추가
    @GetMapping("/reports/{type}")
    public ResponseEntity getReportList(
            @PathVariable ReportType type,
            @RequestParam(required = false, defaultValue = "-1") Integer status,
            @PageableDefault(page = 0, size = 15, sort = "reportedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminReportService.getReportList(member, type, status, pageable);
    }

    @GetMapping("/report/{type}/{reportId}")
    public ResponseEntity getReport(@PathVariable ReportType type, @PathVariable Long reportId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }
        return adminReportService.getReport(member, type, reportId);
    }

    @PutMapping("/report/{type}/{reportId}")
    public ResponseEntity processReport(
            @PathVariable ReportType type, @PathVariable Long reportId,
            @Valid @RequestBody ReportProcessRequestDto req,
            BindingResult errors
    ) {
        Map<String, String> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminReportService.processReport(member, type, reportId, req);
    }

    // TODO: 검색기능추가
    @GetMapping("/posts")
    public ResponseEntity getAdminPostList(
            @RequestParam(required = false, defaultValue = "-1") Integer process,       // -1: 전체, 0: 대기, 1: 승인, 4: 반려
            @PageableDefault(page = 0, size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminPostService.getAdminPostList(member, process, pageable);
    }

    @PutMapping("/post/{postId}")
    public ResponseEntity processPost(
            @PathVariable Long postId,
            @RequestParam(required = true) Integer process      // 1: 승인, 2: 반려
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminPostService.processPost(member, postId, process);
    }

    // TODO: 검색 기능 추가
    @GetMapping("/buyers")
    public ResponseEntity getBuyerList(
            @RequestParam(required = false, defaultValue = "-1") Integer process,   // -1: 전체, 0: 대기, 1: 완료, 3: 취소
            @PageableDefault(page = 0, size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminBuyerService.getBuyerList(member, process, pageable);
    }

    @PutMapping("/buyer/{buyerId}")
    public ResponseEntity processBuyer(
            @PathVariable Long buyerId,
            @RequestParam(required = true) Integer process   // 1: 입금 완료, 2: 재입금 대기, 3: 주문취소
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return adminBuyerService.processBuyer(member, buyerId, process);
    }
}
