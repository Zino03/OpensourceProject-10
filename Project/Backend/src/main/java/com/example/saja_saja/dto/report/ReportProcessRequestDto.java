package com.example.saja_saja.dto.report;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReportProcessRequestDto {
    // 1: 신고 기각, 2: 제재 처리
    @NotNull(message = "처리 상태를 선택해주세요.")
    private Integer status;

    private String bannedReason;
}
