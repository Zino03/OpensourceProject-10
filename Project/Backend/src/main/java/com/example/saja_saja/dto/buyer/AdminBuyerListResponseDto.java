package com.example.saja_saja.dto.buyer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBuyerListResponseDto {
    private String postTitle;

    private String buyerName;

    private String price;

//    private
// TODO: 관리자페이지 결제관리 리스트
}
