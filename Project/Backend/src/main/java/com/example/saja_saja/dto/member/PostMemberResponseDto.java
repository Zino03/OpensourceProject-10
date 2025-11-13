package com.example.saja_saja.dto.member;

import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostMemberResponseDto {
    private Long id;

    private String nickname;

    private String profileImg;

    public static PostMemberResponseDto of(User host) {
        return new PostMemberResponseDto().builder()
                .id(host.getId())
                .nickname(host.getNickname())
                .profileImg(host.getProfileImg())
                .build();
    }
}
