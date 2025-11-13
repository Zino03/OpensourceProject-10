package com.example.saja_saja.controller;

import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.dto.user.UserResponseDto;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @GetMapping("/mypage")

    @PutMapping("/mypage/user/{userId}")
    public UserResponseDto updateUserInfo(@PathVariable Long userId, @RequestBody UserRequestDto req) {
        return userService.updateUserInfo(userId, req);
    }
}
