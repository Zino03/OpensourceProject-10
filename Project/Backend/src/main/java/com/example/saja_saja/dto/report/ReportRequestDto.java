package com.example.saja_saja.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReportRequestDto {
    @NotBlank(message = "신고 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "신고 사유를 입력해주세요.")
    private String content;

    private Long reportedId;

    private String reportedNickname;
}
