package com.example.demo.answer;

import java.time.LocalDateTime;

import com.example.demo.question.Question;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity

public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDateTime createDate;

    @ManyToOne
    private Question question;
}
