package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "post")
@Builder
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id",  nullable = false)
    @JsonIgnore
    private User host;

    private Boolean isCanceled = false;

    private String contact;

    private String title;

    private String image;

    private Integer price;

    private String content;

    private Integer quantity;

    private Integer currentQuantity;

    private Boolean isDeliveryAvailable;

    private Integer deliveryFee;

    @OneToOne(fetch = FetchType.LAZY)
    private Address pickupAddress;

    private LocalDateTime createdAt;

    private LocalDateTime endAt;

    // 0 : 대기, 1 : 진행중, 2 : 마감임박, 3 : 마감, 4 : 반려
    private Integer status;

    private Integer currentPaidQuantity;

    private LocalDateTime lastPaymentEndAt;

    private Category category;

    @OneToMany(mappedBy = "post")
    private List<Buyer> buyers = new ArrayList<>();

    @OneToMany(mappedBy = "post")
    private List<Notice> notices = new ArrayList<>();
}
