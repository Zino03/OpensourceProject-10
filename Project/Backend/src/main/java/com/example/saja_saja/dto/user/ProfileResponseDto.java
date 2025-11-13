package com.example.saja_saja.dto.user;

import com.example.saja_saja.dto.post.MyPostListResponseDto;
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
public class ProfileResponseDto {
    private String name;

    private String nickname;

    private String profileImg;

    private Double mannerScore;

    private List<MyPostListResponseDto> posts;

    public static ProfileResponseDto of(User user) {
        List<Post> userPosts = user.getPosts();

        List<MyPostListResponseDto> dtoList = userPosts.stream()
                .map(MyPostListResponseDto::of)
                .collect(Collectors.toList());

        return ProfileResponseDto.builder()
                .name(user.getName())
                .nickname(user.getNickname())
                .profileImg(user.getProfileImg())
                .mannerScore(user.getMannerScore())
                .posts(dtoList)
                .build();
    }
}
