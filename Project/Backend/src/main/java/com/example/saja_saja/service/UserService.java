package com.example.saja_saja.service;

import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.dto.user.UserResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.MemberRepository;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public UserResponseDto updateUserInfo(Long userId, UserRequestDto req) {
        User user;
        try {
            user = userRepository.findById(userId).get();
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }

        try {
            Member member = user.getMember();

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
            if (req.getPhone() != null) user.setPhone(req.getPhone());


            return UserResponseDto.of(user);
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}