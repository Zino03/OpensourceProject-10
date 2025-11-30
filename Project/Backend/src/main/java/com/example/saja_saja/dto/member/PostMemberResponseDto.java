package com.example.saja_saja.dto.member;

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
    private String nickname;

    private String profileImg;

    private Double mannerScore;

    public static PostMemberResponseDto of(User host) {
        return new PostMemberResponseDto().builder()
                .nickname(host.getNickname())
                .profileImg(host.getProfileImg())
                .mannerScore(host.getTotalStar().doubleValue() /  host.getReceivedReviewCount())
                .build();
    }
}
