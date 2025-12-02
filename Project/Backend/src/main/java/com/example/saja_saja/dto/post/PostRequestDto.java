package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Address;
import com.example.saja_saja.entity.post.Category;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.service.ImageService;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@NoArgsConstructor
public class PostRequestDto {
    @NotBlank(message = "제목을 입력해주세요.")
    private String title;
    @NotNull(message = "가격을 입력해주세요.")
    @Min(value = 1, message = "가격은 1원 이상이어야 합니다.")
    private Integer price;
    @NotBlank(message = "내용을 입력해주세요.")
    private String content;
    @NotNull(message = "목표 수량을 입력해주세요.")
    @Min(value = 1, message = "목표 수량은 1개 이상이어야 합니다.")
    private Integer quantity;
    private Boolean isDeliveryAvailable;
    private Integer deliveryFee;
    @NotNull(message = "주소를 입력해주세요.")
    private Address pickupAddress;
    @NotNull(message = "마감기한을 입력해주세요.")
    @Future(message = "마감일은 현재 시각 이후로 설정해야 합니다.")
    private LocalDateTime endAt;
    @NotNull(message = "카테고리를 선택해주세요.")
    private Category category;
    @NotBlank(message = "연락수단을 입력해주세요")
    private String contact;

    public Post toPost() {
        return Post.builder()
                .isCanceled(false)
                .title(title)
                .image(null)
                .price(price)
                .content(content)
                .quantity(quantity)
                .currentQuantity(0)
                .currentPaidQuantity(0)
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
