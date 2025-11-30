package com.example.saja_saja.dto.post;

import jakarta.validation.constraints.Max;
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
public class ReviewRequestDto {
    @NotNull(message = "내용을 입력해주세요.")
    private String content;

    @Max(value = 5, message = "5 이하의 숫자를 입력해주세요.")
    @Min(value = 1, message = "1 이상의 숫자를 입력해주세요.")
    private Integer star;
}
