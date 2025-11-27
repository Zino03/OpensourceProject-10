package com.example.saja_saja.dto.report;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReportProcessRequestDto {
    @NotBlank(message = "처리 상태를 선택해주세요.")
    private Integer status;

    private String bannedReason;
}
