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

    private List<MyPostListResponseDto> activePosts;

    private List<MyPostListResponseDto> closedPosts;

    public static ProfileResponseDto of(User user) {
        List<Post> userPosts = user.getPosts();

        List<MyPostListResponseDto> activePostList = userPosts.stream()
                .filter(post -> post.getStatus() == 1 || post.getStatus() == 2)
                .map(MyPostListResponseDto::of)
                .collect(Collectors.toList());

        List<MyPostListResponseDto> closedPostList = userPosts.stream()
                .filter(post -> post.getStatus() == 3)
                .map(MyPostListResponseDto::of)
                .collect(Collectors.toList());

        return ProfileResponseDto.builder()
                .name(user.getName())
                .nickname(user.getNickname())
                .profileImg(user.getProfileImg())
                .mannerScore(user.getMannerScore())
                .activePosts(activePostList)
                .closedPosts(closedPostList)
                .build();
    }
}
