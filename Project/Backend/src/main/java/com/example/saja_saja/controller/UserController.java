package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.user.UserRequestDto;
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
public class UserController {
    private final UserService userService;
    private final ReportService reportService;

//    @GetMapping("/info")

    @PutMapping("/mypage/user")
    public ResponseEntity updateUserInfo(@RequestBody UserRequestDto req) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return userService.updateUserInfo(member, req);
    }

//    @GetMapping("/mypage/address")
//    public String getAddress() {
//        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
//        return
//    }

    @GetMapping("/mypage/reports/reviews")
    public ResponseEntity getReviewReportList(
            @PageableDefault(size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.getReviewReportList(member, pageable);
    }

//    @GetMapping("/mypage/reports/users")

//    @GetMapping("/mypage/myposts")
//    public ResponseEntity<Page<MyPostListResponseDto>> getPostList(@PageableDefault(size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
//    }

//    @GetMapping("/mypage/joinedposts")

    @GetMapping("/user/{userId}")
    public ResponseEntity getProfile(@PathVariable Long userId) {
        return userService.getProfile(userId);
    }
}
