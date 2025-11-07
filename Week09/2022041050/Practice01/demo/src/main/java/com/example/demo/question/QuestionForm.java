package com.example.demo.question;

import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@Setter
public class QuestionForm {
    @NotEmpty(message = "제목은 필수 항목입니다.")
    @Size(max=200)
    private String subject;

    @NotEmpty(message = "내용은 필수 항목입니다.")
    private String content;
}
