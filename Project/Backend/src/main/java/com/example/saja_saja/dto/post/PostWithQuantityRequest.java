package com.example.saja_saja.dto.post;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostWithQuantityRequest {
    private PostRequestDto post;
    private int quantity;
}