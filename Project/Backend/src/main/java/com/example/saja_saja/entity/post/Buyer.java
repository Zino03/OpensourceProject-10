package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "buyer")
public class Buyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnore
    private Post post;

    private Integer quantity;

    private Boolean isDelivery;

    // 0: 대기, 1: 지불, 2: 반려
    private Integer isPaid;

    private LocalDateTime receivedAt;

    // 0: 대기, 1: 수령확인
    private Boolean isConfirmed;

    private LocalDateTime createdAt;

    private Boolean isCanceled;

    private LocalDateTime canceledAt;

    @OneToOne
    @JoinColumn(name = "review_id")
    private Review review;
}
