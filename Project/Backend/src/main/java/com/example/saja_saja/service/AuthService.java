package com.example.saja_saja.service;

import com.example.saja_saja.dto.member.LoginRequestDto;
import com.example.saja_saja.dto.token.TokenDto;
import com.example.saja_saja.dto.token.TokenRequestDto;
import com.example.saja_saja.dto.member.MemberRequestDto;
import com.example.saja_saja.dto.member.MemberResponseDto;
import com.example.saja_saja.entity.token.RefreshToken;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.UserRepository;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.UnauthorizedException;
import com.example.saja_saja.jwt.TokenProvider;
import com.example.saja_saja.entity.token.RefreshTokenRepository;
import com.example.saja_saja.entity.member.MemberRepository;
import com.example.saja_saja.response.DefaultRes;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    public static HashMap<String, Object> data = new HashMap<>();
    private final UserRepository userRepository;

    public boolean passwordDuplicate(String password, String passwordCk) {
        return password.equals(passwordCk);
    }

    @Transactional
    public ResponseEntity signup(MemberRequestDto memberRequestDto, BindingResult errors) {
        if(errors.hasErrors()) {
            Map<String, String> validatorResult = new HashMap<>();

            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }

            return new ResponseEntity(validatorResult, HttpStatus.OK);
        }

        if(memberRepository.findByEmail(memberRequestDto.getEmail()).isPresent()) {
            throw new BadRequestException("이미 가입되어 있는 유저입니다", null);
        } else if(userRepository.findByNickname(memberRequestDto.getNickname()).isPresent()) {
            throw new BadRequestException("사용중인 닉네임입니다", null);
        } else if(userRepository.findByPhone(memberRequestDto.getPhone()).isPresent()) {
            throw new BadRequestException("이미 가입되어 있는 유저입니다", null);
        } else if(!passwordDuplicate(memberRequestDto.getPassword(), memberRequestDto.getPasswordck())) {
            throw new BadRequestException("비밀번호가 다릅니다", null);
        }

        Member user = memberRequestDto.toMember(passwordEncoder);

        data.put("message", "회원가입이 완료되었습니다");
        data.put("data", MemberResponseDto.of(memberRepository.save(user)));

        return new ResponseEntity(data, HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity login(LoginRequestDto loginRequestDto) {
        UsernamePasswordAuthenticationToken authenticationToken = loginRequestDto.toAuthentication();

        Authentication authentication;
        try {
            authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        } catch (InternalAuthenticationServiceException e) {
            // 안쪽에 우리가 던진 BadRequestException이 있으면 다시 던져주기
            if (e.getCause() instanceof BadRequestException bre) {
                throw bre;
            }
            throw e; // 나머지는 그대로
        }

        TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

        RefreshToken refreshToken = RefreshToken.builder()
                .key(authentication.getName())
                .value(tokenDto.getRefreshToken())
                .build();

        refreshTokenRepository.save(refreshToken);

        data.clear();
        data.put("message", "로그인이 완료되었습니다");
        data.put("token", tokenDto);

        return new ResponseEntity(data, HttpStatus.OK);
    }

    @Transactional
    public TokenDto reissue(TokenRequestDto tokenRequestDto) {
        if(!tokenProvider.validateToken(tokenRequestDto.getRefreshToken())) {
            throw new UnauthorizedException("Refresh Token 이 유효하지 않습니다.");
        }

        Authentication authentication = tokenProvider.getAuthentication(tokenRequestDto.getAccessToken());

        RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("로그아웃 된 사용자입니다."));

        if(!refreshToken.getValue().equals(tokenRequestDto.getRefreshToken())) {
            throw new UnauthorizedException("토큰의 유저 정보가 일치하지 않습니다.");
        }

        TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

        RefreshToken newRefreshToken = refreshToken.updateValue(tokenDto.getRefreshToken());
        refreshTokenRepository.save(newRefreshToken);

        return tokenDto;
    }
}