package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
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

    private Integer price;

    private Integer quantity;

    private String payerName;

    private String payerEmail;

    private Boolean isDelivery;

    // 0: 결제대기, 1: 결제완료, 2: 재결제대기, 3: 주문취소
    private Integer isPaid;

    @OneToOne
    private UserAddress userAddress;

    private String courier;

    private String trackingNumber;

    private LocalDateTime receivedAt;

    private LocalDateTime createdAt;

    private Boolean isCanceled;

    private LocalDateTime canceledAt;

    // 사용자가 제재당하면 구매자 책임
    // 0: 단순변심, 1: 공구취소, 2: 결제 미완료
    private Integer canceledReason;

    // TODO: status 사용 중인 곳 올바르게 수정
    // 0: 주문 접수, 1: 결제완료, 2: 상품 준비중, 3: 배송중, 4: 배송완료, 5: 구매확정, 6: 주문취소
    private Integer status;

    @OneToOne
    @JoinColumn(name = "review_id")
    private Review review;
}
