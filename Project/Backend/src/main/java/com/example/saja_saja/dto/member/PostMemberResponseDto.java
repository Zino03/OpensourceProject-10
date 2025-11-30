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
        Double calculatedMannerScore = 0.0;
        if (host.getIsBanned()) calculatedMannerScore = -1.0;
        else if (host.getReceivedReviewCount() != 0.0) calculatedMannerScore = host.getTotalStar().doubleValue() / host.getReceivedReviewCount();

        return PostMemberResponseDto.builder()
                .nickname(host.getNickname())
                .profileImg(host.getProfileImg())
                .mannerScore(calculatedMannerScore)
                .build();
    }
}
