package com.example.saja_saja.controller;

import com.example.saja_saja.dto.member.FindPwRequestDto;
import com.example.saja_saja.dto.member.LoginRequestDto;
import com.example.saja_saja.dto.token.TokenDto;
import com.example.saja_saja.dto.token.TokenRequestDto;
import com.example.saja_saja.dto.member.MemberRequestDto;
import com.example.saja_saja.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity signup(@Valid @RequestBody MemberRequestDto memberRequestDto, BindingResult errors) {
        return authService.signup(memberRequestDto, errors);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDto loginRequestDto, BindingResult errors) {
        return authService.login(loginRequestDto, errors);
    }

    @PostMapping("/findpw")
    public ResponseEntity findPw(@RequestBody FindPwRequestDto findPwRequestDto, BindingResult errors) {
        return authService.findPw(findPwRequestDto, errors);
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenDto> reissue(@RequestBody TokenRequestDto tokenRequestDto) {
        return ResponseEntity.ok(authService.reissue(tokenRequestDto));
    }

}
