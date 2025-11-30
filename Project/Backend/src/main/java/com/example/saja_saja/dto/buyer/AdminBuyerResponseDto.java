package com.example.saja_saja.dto.buyer;

import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminBuyerResponseDto {
    private Long id;

    private Long postId;

    private String postTitle;

    private String buyerNickname;

    private Integer price;

    private LocalDateTime postEndAt;

    private LocalDateTime paymentEndAt;

    private Integer isPaid;

    private String payerName;

    public static AdminBuyerResponseDto of(Buyer buyer) {
        Post post = buyer.getPost();

        return new AdminBuyerResponseDto(
                buyer.getId(),
                post.getId(),
                post.getTitle(),
                buyer.getUser().getNickname(),
                buyer.getPrice(),
                post.getEndAt(),
                buyer.getCreatedAt().plusDays(7),
                buyer.getIsPaid(),
                buyer.getPayerName()
        );
    }
}
