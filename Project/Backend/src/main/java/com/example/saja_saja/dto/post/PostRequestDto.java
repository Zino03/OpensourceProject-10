package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Address;
import com.example.saja_saja.entity.post.Category;
import com.example.saja_saja.entity.post.Post;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@NoArgsConstructor
public class PostRequestDto {
    private String title;
    private String image;
    private Integer price;
    private String content;
    private Integer quantity;
    private Boolean isDeliveryAvailable;
    private Integer deliveryFee;
    private Address pickupAddress;
    private LocalDateTime endAt;
    private Category category;

    public Post toPost() {
        return Post.builder()
                .title(title)
                .image(image)
                .price(price)
                .content(content)
                .quantity(quantity)
                .isDeliveryAvailable(isDeliveryAvailable)
                .deliveryFee(deliveryFee)
                .pickupAddress(pickupAddress)
                .endAt(endAt)
                .category(category)
                .notices(new ArrayList<>())
                .buyers(new ArrayList<>())
                .build();
    }
}
