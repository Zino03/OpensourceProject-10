package com.example.saja_saja.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceivedAtRequestDto {

    @NotBlank(message = "사용자 닉네임을 입력해주세요.")
    private String userNickname;

    @NotBlank(message = "택배사를 입력해주세요.")
    LocalDateTime receivedAt;
}
