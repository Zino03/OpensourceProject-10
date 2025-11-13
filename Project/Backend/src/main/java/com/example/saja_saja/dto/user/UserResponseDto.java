package com.example.saja_saja.dto.user;

import com.example.saja_saja.dto.member.MemberResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDto {
    // TODO: fix data
    private String email;

    private String nickname;

    private String profileImg;

    private String address;

    private String account;

    private String phone;

    public static UserResponseDto of(User user) {
        return new UserResponseDto().builder()
                .email(user.getMember().getEmail())
                .nickname(user.getNickname())
                .profileImg(user.getProfileImg())
                .address(user.getAddress())
                .account(user.getAccount())
                .build();
    }
}
