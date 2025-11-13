package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReviewReportListResponseDto;
import com.example.saja_saja.dto.user.ProfileResponseDto;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.dto.user.UserResponseDto;
import com.example.saja_saja.service.ReviewReportService;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ReviewReportService reviewReportService;

//    @GetMapping("/info")

    @PutMapping("/mypage/info")
    public UserResponseDto updateUserInfo(@RequestBody UserRequestDto req) {
        Long userId = SecurityUtil.getCurrentUserId();
        return userService.updateUserInfo(userId, req);
    }

    @GetMapping("/mypage/reports/reviews")
    public ResponseEntity<Page<ReviewReportListResponseDto>> getReviewReportList(
            @PageableDefault(size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Long userId = SecurityUtil.getCurrentUserId();
        Page<ReviewReportListResponseDto> reports = reviewReportService.getReviewReportList(userId, pageable);
        return ResponseEntity.ok(reports);
    }

//    @GetMapping("/mypage/reports/users")

//    @GetMapping("/mypage/myposts")
//    public ResponseEntity<Page<MyPostListResponseDto>> getPostList(@PageableDefault(size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
//    }

//    @GetMapping("/mypage/joinedposts")

    @GetMapping("/user/{userId}")
    public ProfileResponseDto getProfile(@PathVariable Long userId) {
        return userService.getProfile(userId);
    }
}
