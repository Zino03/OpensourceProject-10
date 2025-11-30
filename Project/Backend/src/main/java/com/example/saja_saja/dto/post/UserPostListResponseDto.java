package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPostListResponseDto {
    private Long id;
    private String title;
    private String image;
    private LocalDateTime endAt;
    private Integer price;
    private Integer quantity;
    private Integer currentQuantity;
    private Integer receivedPrice;
    // 0 : 대기, 1 : 진행중, 2 : 마감임박, 3 : 마감, 4 : 반려, 5: 취소
    private Integer status;

    public static UserPostListResponseDto of(Post post) {
        return builder()
                .id(post.getId())
                .title(post.getTitle())
                .image(post.getImage())
                .endAt(post.getEndAt())
                .price(post.getPrice())
                .quantity(post.getQuantity())
                .currentQuantity(post.getCurrentQuantity())
                .receivedPrice(post.getPrice()*post.getQuantity())
                .status(post.getIsCanceled().equals(true) ? 5 : post.getStatus())
                .build();
    }
}
