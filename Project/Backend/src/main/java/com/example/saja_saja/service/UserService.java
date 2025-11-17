package com.example.saja_saja.service;

import com.example.saja_saja.dto.user.ProfileResponseDto;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.dto.user.UserResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.MemberRepository;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserRepository;
import com.example.saja_saja.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Transactional
@Service
@RequiredArgsConstructor
public class UserService {
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Member getMember(Long userId) {
        try {
            if(userId==null) throw new Exception();
            return memberRepository.findById(userId).get();
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getAddress(Long userId) {
        return userRepository.findById(userId).get().getAddress();
    }

    @Transactional
    public ResponseEntity updateUserInfo(Member member, UserRequestDto req) {
        try {
            Long userId = member.getUser().getId();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("인증된 사용자 정보를 찾을 수 없습니다.")); // 404 발생 원인

            if (req.getPassword() != null && !req.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(req.getPassword());
                member.setPassword(hashedPassword);
            }

            if (req.getEmail() != null) {
                member.setEmail(req.getEmail());
            }

            if (req.getNickname() != null) user.setNickname(req.getNickname());
            if (req.getProfileImg() != null) user.setProfileImg(req.getProfileImg());
            if (req.getAddress() != null) user.setAddress(req.getAddress());
            if (req.getAccount() != null) user.setAccount(req.getAccount());

            HashMap<String, Object> data = new HashMap<>();
            data.put("user", UserResponseDto.of(user));
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("변경에 실패하였습니다.");
        }
    }

    public ResponseEntity getProfile(Long userId) {
        Optional<User> optional = userRepository.findById(userId);

        if (optional.isPresent()) {
            ProfileResponseDto profile = ProfileResponseDto.of(userRepository.findById(userId).get());

            HashMap<String, Object> data = new HashMap<>();
            data.put("profile", profile);
            return new ResponseEntity(data, HttpStatus.OK);
        } else {
            throw new ResourceNotFoundException("해당 사용자를 찾을 수 없습니다");
        }
    }
}