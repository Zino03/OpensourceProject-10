package com.example.saja_saja.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingNumberRequestDto {

    @NotBlank(message = "사용자 닉네임을 입력해주세요.")
    private String userNickname;

    @NotBlank(message = "택배사를 입력해주세요.")
    private String courier;

    @NotBlank(message = "운송장 번호를 입력해주세요.")
    private String trackingNumber;
}
