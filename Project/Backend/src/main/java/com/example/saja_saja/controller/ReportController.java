package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.report.ReportRequestDto;
import com.example.saja_saja.dto.report.ReportType;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.service.ReportService;
import com.example.saja_saja.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReportController {
    private final UserService userService;
    private final ReportService reportService;

    @PostMapping("/report/{type}")
    public ResponseEntity createReport(
            @PathVariable ReportType type,
            @Valid @RequestBody ReportRequestDto req,
            BindingResult errors
    ) {
        Map<String, Object> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        if (!validatorResult.isEmpty()) {
            validatorResult.put("data", req);
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return reportService.createReport(member, type, req);
    }
}
