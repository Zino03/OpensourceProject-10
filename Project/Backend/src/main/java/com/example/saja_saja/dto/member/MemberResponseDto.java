package com.example.saja_saja.dto.member;

import com.example.saja_saja.entity.member.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberResponseDto {
    private String email;

    private String name;

    private String nickname;

    private String phone;

    private String profileImg;

    private String account;

    public static MemberResponseDto of(Member member) {
        return new MemberResponseDto().builder()
                .email(member.getEmail())
                .name(member.getUser().getName())
                .nickname(member.getUser().getNickname())
                .phone(member.getUser().getPhone())
                .profileImg(member.getUser().getProfileImg())
                .account(member.getUser().getAccount())
                .build();
    }
}