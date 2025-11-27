package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminPostListResponseDto {
    private Long id;

    private String title;

    private String hostNickname;

    private LocalDateTime endAt;

    private LocalDateTime createdAt;

    private Integer status;

    public static AdminPostListResponseDto of(Post post) {
        return new AdminPostListResponseDto().builder()
                .id(post.getId())
                .title(post.getTitle())
                .hostNickname(post.getHost().getNickname())
                .endAt(post.getEndAt())
                .createdAt(post.getCreatedAt())
                .status(post.getStatus())
                .build();
    }
}
