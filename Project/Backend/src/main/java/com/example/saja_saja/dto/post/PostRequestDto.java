package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Address;
import com.example.saja_saja.entity.post.Category;
import com.example.saja_saja.entity.post.Post;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@NoArgsConstructor
public class PostRequestDto {
    @NotBlank(message = "제목을 입력해주세요.")
    private String title;
    @NotBlank(message = "이미지를 등록해주세요.")
    private String image;
    @NotBlank(message = "가격을 입력해주세요.")
    private Integer price;
    @NotBlank(message = "내용을 입력해주세요.")
    private String content;
    @NotBlank(message = "수량을 입력해주세요.")
    private Integer quantity;
    private Boolean isDeliveryAvailable;
    private Integer deliveryFee;
    @NotBlank(message = "주소를 입력해주세요.")
    private Address pickupAddress;
    @NotBlank(message = "마감기한을 입력해주세요.")
    private LocalDateTime endAt;
    @NotBlank(message = "카테고리를 선택해주세요.")
    private Category category;
    @NotBlank(message = "연락수단을 입력해주세요")
    private String contact;

    public Post toPost() {
        return Post.builder()
                .isCanceled(false)
                .title(title)
                .image(image)
                .price(price)
                .content(content)
                .quantity(quantity)
                .currentQuantity(0)
                .isDeliveryAvailable(isDeliveryAvailable)
                .deliveryFee(deliveryFee)
                .pickupAddress(pickupAddress)
                .createdAt(LocalDateTime.now())
                .endAt(endAt)
                .category(category)
                .contact(contact)
                .status(0)
                .notices(new ArrayList<>())
                .buyers(new ArrayList<>())
                .build();
    }
}
