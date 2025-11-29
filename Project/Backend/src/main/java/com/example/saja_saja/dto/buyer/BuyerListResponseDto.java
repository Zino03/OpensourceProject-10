package com.example.saja_saja.dto.buyer;

import com.example.saja_saja.dto.member.PostMemberResponseDto;
import com.example.saja_saja.dto.post.PostResponseDto;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.user.UserAddress;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerListResponseDto {
    private String userName;

    private String userNickname;

    private Integer price;

    // 0: 대기, 1: 지불
    private Integer isPaid;

    private String courier;

    private String trackingNumber;

    private UserAddress userAddress;

    private LocalDateTime receivedAt;

    public static BuyerListResponseDto of(Buyer buyer, int price) {
        return builder()
                .userName(buyer.getUser().getName())
                .userNickname(buyer.getUser().getNickname())
                .price(buyer.getQuantity()*price)
                .isPaid(buyer.getIsPaid())
                .courier(buyer.getCourier())
                .trackingNumber(buyer.getTrackingNumber())
                .userAddress(buyer.getUserAddress())
                .receivedAt(buyer.getReceivedAt())
                .build();
    }
}
