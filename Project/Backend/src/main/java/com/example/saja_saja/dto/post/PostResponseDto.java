package com.example.saja_saja.dto.post;

import com.example.saja_saja.dto.member.PostMemberResponseDto;
import com.example.saja_saja.entity.post.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDto {
    private Long id;

    private PostMemberResponseDto host;

    private Boolean isCanceled;

    private String contact;

    private String title;

    private String image;

    private Integer price;

    private String content;

    private Integer quantity;

    private Integer currentQuantity;

    private Boolean isDeliveryAvailable;

    private Integer deliveryFee;

    private Address pickupAddress;

    private LocalDateTime createdAt;

    private LocalDateTime endAt;

    private Integer status;

    private Category category;

    private List<Notice> notices = new ArrayList<>();

    private List<Review> reviews = new ArrayList<>();

    public static PostResponseDto of(Post post) {
        return builder()
                .id(post.getId())
                .host(PostMemberResponseDto.of(post.getHost()))
                .isCanceled(post.getIsCanceled())
                .contact(post.getContact())
                .title(post.getTitle())
                .image(post.getImage())
                .price(post.getPrice())
                .content(post.getContent())
                .quantity(post.getQuantity())
                .currentQuantity(post.getCurrentQuantity())
                .isDeliveryAvailable(post.getIsDeliveryAvailable())
                .deliveryFee(post.getDeliveryFee())
                .pickupAddress(post.getPickupAddress())
                .createdAt(post.getCreatedAt())
                .endAt(post.getEndAt())
                .status(post.getStatus())
                .category(post.getCategory())
                .notices(post.getNotices())
                .reviews(new ArrayList<>())
                .build();
    }
}
