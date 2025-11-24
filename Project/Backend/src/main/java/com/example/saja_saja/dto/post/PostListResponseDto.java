package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Category;
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
public class PostListResponseDto {
    private Long id;

    private String title;

    private String image;

    private Integer price;

    private Integer quantity;

    private Integer currentQuantity;

    private Category category;

    private Integer type; // 1 : 모집중, 2 : 마감임박, 3 : 마감

    private LocalDateTime endAt;

    public static PostListResponseDto of(Post post) {
        return new PostListResponseDto().builder()
                .id(post.getId())
                .title(post.getTitle())
                .image(post.getImage())
                .price(post.getPrice())
                .quantity(post.getQuantity())
                .currentQuantity(post.getCurrentQuantity())
                .category(post.getCategory())
                .type(post.getStatus())
                .endAt(post.getEndAt())
                .build();
    }
}
