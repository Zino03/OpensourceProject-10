package com.example.saja_saja.dto.buyer;

import com.example.saja_saja.entity.post.Buyer;
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
public class CanceledOrderListResponseDto {
    private Long Id;

    private Long postId;

    private String postTitle;

    private Integer quantity;

    private LocalDateTime canceledAt;

    private Integer canceledReason;

    public static CanceledOrderListResponseDto of(Buyer buyer) {
        Post post =  buyer.getPost();

        return new CanceledOrderListResponseDto(
                buyer.getId(),
                post.getId(),
                post.getTitle(),
                buyer.getQuantity(),
                buyer.getCanceledAt(),
                buyer.getCanceledReason()
        );
    }
}
