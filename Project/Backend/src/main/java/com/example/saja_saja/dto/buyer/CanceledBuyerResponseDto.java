package com.example.saja_saja.dto.buyer;

import com.example.saja_saja.entity.post.Buyer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CanceledBuyerResponseDto {
    private Buyer buyer;

    private String hostNickname;

    public static CanceledBuyerResponseDto of(Buyer buyer, String hostNickname) {
        return CanceledBuyerResponseDto.builder()
                .buyer(buyer)
                .hostNickname(hostNickname)
                .build();
    }
}
