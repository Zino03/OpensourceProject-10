package com.example.saja_saja.dto.post;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "수령 일시를 입력해주세요.")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    LocalDateTime receivedAt;
}
