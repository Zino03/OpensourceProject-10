package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Buyer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BuyerApplyResponseDto {
    private String virtualAccountBank;
    private String virtualAccount;
    private Integer price;
    private LocalDateTime paymentEndAt;
    private LocalDateTime createdAt;
    private String productName;
    private Integer quantity;
    private String payerMethod;
    private String payerName;
    private String payerEmail;
    public static BuyerApplyResponseDto of(Buyer buyer) {
        return BuyerApplyResponseDto.builder()
                .virtualAccountBank(buyer.getUser().getVirtualAccountBank())
                .virtualAccount(buyer.getUser().getVirtualAccount())
                .price(buyer.getPrice())
                .paymentEndAt(buyer.getCreatedAt().plusDays(7))
                .createdAt(buyer.getCreatedAt())
                .productName(buyer.getPost().getTitle())
                .quantity(buyer.getPost().getQuantity())
                .payerMethod("무통장입금")
                .payerName(buyer.getPayerName())
                .payerEmail(buyer.getPayerEmail())
                .build();
    }
}
