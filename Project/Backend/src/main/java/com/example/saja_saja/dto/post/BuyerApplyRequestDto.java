package com.example.saja_saja.dto.post;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuyerApplyRequestDto {

    @NotNull(message = "배송 여부를 입력해주세요.")
    private Boolean isDelivery;

    private Long userAddressId;   // isDelivery == true 일 때만 필수

    @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
    private int requestQuantity;
}
