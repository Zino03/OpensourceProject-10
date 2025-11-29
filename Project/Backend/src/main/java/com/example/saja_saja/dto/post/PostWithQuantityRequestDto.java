package com.example.saja_saja.dto.post;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostWithQuantityRequestDto {
    @Valid
    private PostRequestDto post;

    @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
    private int quantity;
}
