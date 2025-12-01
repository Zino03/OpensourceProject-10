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
        UserAddress userAddress;
        if(buyer.getIsDelivery().equals(true)) {
            userAddress = buyer.getUserAddress();
        } else {
            userAddress = new UserAddress(-1l,"" ,"" ,"",-1,"","",EntranceAccess.OTHER,"",false, user);
        }
        Post post = buyer.getPost();
        User host = post.getHost();

        return OrderResponseDto.builder()
                .recipient(userAddress.getRecipient())
                .addressStreet(userAddress.getStreet())
                .addressPhone(userAddress.getPhone())
                .entranceAccess(userAddress.getEntranceAccess())
                .entranceDetail(userAddress.getEntranceDetail())
                .postId(post.getId())
                .postImg(post.getImage())
                .postTitle(post.getTitle())
                .endAt(post.getEndAt())
                .hostName(host.getName())
                .hostNickname(host.getNickname())
                .deliveryFee(post.getDeliveryFee())
                .pickupAddress(post.getPickupAddress().getStreet())
                .createdAt(buyer.getCreatedAt())
                .courier(buyer.getCourier())
                .trackingNumber(buyer.getTrackingNumber())
                .price(buyer.getPrice())
                .quantity(buyer.getQuantity())
                .isDelivery(buyer.getIsDelivery())
                .status(buyer.getStatus())
                .receivedAt(buyer.getReceivedAt())
                .virtualAccount(user.getVirtualAccount())
                .virtualAccountBank(user.getVirtualAccountBank())
                .buyerName(user.getName())
                .buyerPhone(user.getPhone())
                .email(user.getMember().getEmail())
                .build();
    }

}
