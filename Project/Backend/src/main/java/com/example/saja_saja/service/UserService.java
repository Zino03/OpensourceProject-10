package com.example.saja_saja.service;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class UserService {
    private final MemberRepository memberRepository;

    public Member getMember(Long userId) {
        try {
            if(userId==null) throw new Exception();
            return memberRepository.findById(userId).get();
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}