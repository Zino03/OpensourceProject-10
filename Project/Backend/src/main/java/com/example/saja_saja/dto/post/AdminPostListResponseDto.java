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

    // 게시물관리    0: 대기, 1: 승인, 4: 반려
    // 정산처리     0: 대기, 1: 완료(지불), 2: 반려
    private Integer process;

    public static AdminPostListResponseDto of(Post post) {
        return new AdminPostListResponseDto().builder()
                .id(post.getId())
                .title(post.getTitle())
                .hostNickname(post.getHost().getNickname())
                .endAt(post.getEndAt())
                .createdAt(post.getCreatedAt())
                .process(post.getStatus())
                .build();
    }
}
