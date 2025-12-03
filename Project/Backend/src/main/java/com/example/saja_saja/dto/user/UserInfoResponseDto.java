package com.example.saja_saja.dto.user;

import com.example.saja_saja.dto.post.PostListResponseDto;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserInfoResponseDto {
    private String name;

    private String nickname;

    private String profileImg;

    private String phone;

    private String email;

    private String account;

    private String accountBank;

    public static UserInfoResponseDto of(User user) {
        return UserInfoResponseDto.builder()
                .name(user.getName())
                .nickname(user.getNickname())
                .profileImg(user.getProfileImg())
                .phone(user.getPhone())
                .account(user.getAccount())
                .accountBank(user.getAccountBank())
                .email(user.getMember().getEmail())
                .build();
    }
}
