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
public class OrderListResponseDto {
    private Long id;

    private Long postId;

    private String postTitle;

    private String postContact;

    private String hostNickname;

    private Integer quantity;

    private LocalDateTime createdAt;

    private Integer price;

    private LocalDateTime receivedAt;

    private String courier;

    private String trackingNumber;

    private Integer status;

    public static OrderListResponseDto of(Buyer buyer) {
        Post post = buyer.getPost();

        return new OrderListResponseDto(
                buyer.getId(),
                post.getId(),
                post.getTitle(),
                post.getContact(),
                post.getHost().getNickname(),
                buyer.getQuantity(),
                buyer.getCreatedAt(),
                buyer.getPrice(),
                buyer.getReceivedAt(),
                buyer.getCourier(),
                buyer.getTrackingNumber(),
                buyer.getStatus()
        );
    }
}
