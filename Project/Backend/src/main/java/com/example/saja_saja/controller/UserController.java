package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.user.UserAddressDto;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PutMapping("/mypage/user")
    public ResponseEntity updateUserInfo(@RequestBody UserRequestDto req) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return userService.updateUserInfo(member, req);
    }

    @GetMapping("/user/{nickname}")
    public ResponseEntity getProfile(@PathVariable String nickname) {
        return userService.getProfile(nickname);
    }

    @GetMapping("/mypage/addresses")
    public ResponseEntity getAddresses() {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.getAddress(userId);
    }

    @PostMapping("/mypage/address")
    public ResponseEntity addUserAddress(@RequestBody UserAddressDto addressDto) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.addAddress(userId, addressDto);
    }

    @PutMapping("/mypage/address/{addressId}")
    public ResponseEntity updateUserAddress(@PathVariable Long addressId, @RequestBody UserAddressDto addressDto) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.updateUserAddress(userId, addressId, addressDto);
    }

    @DeleteMapping("/mypage/address/{addressId}")
    public ResponseEntity deleteUserAddress(@PathVariable Long addressId) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.deleteUserAddress(userId, addressId);
    }
}
