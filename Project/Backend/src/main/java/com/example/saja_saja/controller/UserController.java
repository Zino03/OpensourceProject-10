package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.dto.user.UserResponseDto;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @GetMapping("/")

    @PutMapping("/info")
    public UserResponseDto updateUserInfo(@RequestBody UserRequestDto req) {
        Long userId = SecurityUtil.getCurrentUserId();
        return userService.updateUserInfo(userId, req);
    }

//    @GetMapping("/")
}
