package com.example.saja_saja.entity.report;

import com.example.saja_saja.entity.post.Notice;
import com.example.saja_saja.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notice_report")
public class NoticeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id",  nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_notice_id",  nullable = false)
    private Notice reportedNotice;

    private String content;

    private LocalDateTime reportedAt;
}
