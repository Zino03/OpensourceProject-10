package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.user.UserAddressRequestDto;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;


    @GetMapping("/user/{nickname}")
    public ResponseEntity getProfile(@PathVariable String nickname) {
        return userService.getProfile(nickname);
    }

    @PutMapping("/mypage/user")
    public ResponseEntity updateUserInfo(@RequestBody UserRequestDto req) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return userService.updateUserInfo(member, req);
    }

    @GetMapping("/mypage/addresses")
    public ResponseEntity getAddresses() {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.getAddressList(userId);
    }

    @PostMapping("/mypage/address")
    public ResponseEntity addUserAddress(
            @Valid @RequestBody UserAddressRequestDto req,
            BindingResult errors
    ) {
        Map<String, Object> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        if (!validatorResult.isEmpty()) {
            validatorResult.put("data", req);
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.addAddress(userId, req);
    }

    @PutMapping("/mypage/address/{addressId}")
    public ResponseEntity updateUserAddress(@PathVariable Long addressId, @RequestBody UserAddressRequestDto addressDto) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.updateUserAddress(userId, addressId, addressDto);
    }

    @DeleteMapping("/mypage/address/{addressId}")
    public ResponseEntity deleteUserAddress(@PathVariable Long addressId) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.deleteUserAddress(userId, addressId);
    }

    // TODO: 주문내역 조회
    // TODO: 주최 공구 조회
}
