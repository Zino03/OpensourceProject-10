package com.example.saja_saja.dto.buyer;

import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.user.EntranceAccess;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private String recipient;

    private String addressStreet;

    private String addressPhone;

    private EntranceAccess entranceAccess;

    private String entranceDetail;

    private Long postId;

    private String postImg;

    private String postTitle;

    private LocalDateTime endAt;

    private String hostName;

    private String hostNickname;

    private Integer deliveryFee;

    private String pickupAddress;

    private LocalDateTime createdAt;

    private String courier;

    private String trackingNumber;

    private Integer price;

    private Integer quantity;

    private Boolean isDelivery;

    private Integer status;

    private LocalDateTime receivedAt;

    private String virtualAccount;

    private String virtualAccountBank;

    private String buyerName;

    private String buyerPhone;

    private String email;

    public static OrderResponseDto of(Buyer buyer) {
        User user = buyer.getUser();
        UserAddress userAddress = buyer.getUserAddress();
        Post post = buyer.getPost();
        User host = post.getHost();

        return new OrderResponseDto(
                userAddress.getRecipient(),
                userAddress.getStreet(),
                userAddress.getPhone(),
                userAddress.getEntranceAccess(),
                userAddress.getEntranceDetail(),
                post.getId(),
                post.getImage(),
                post.getTitle(),
                post.getEndAt(),
                host.getName(),
                host.getNickname(),
                post.getDeliveryFee(),
                post.getPickupAddress().getStreet(),
                buyer.getCreatedAt(),
                buyer.getCourier(),
                buyer.getTrackingNumber(),
                buyer.getPrice(),
                buyer.getQuantity(),
                buyer.getIsDelivery(),
                buyer.getStatus(),
                buyer.getReceivedAt(),
                user.getVirtualAccount(),
                user.getVirtualAccountBank(),
                user.getName(),
                user.getPhone(),
                user.getMember().getEmail()
        );
    }
}
