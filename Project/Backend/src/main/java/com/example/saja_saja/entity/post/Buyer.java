package com.example.saja_saja.entity.post;

import com.example.saja_saja.entity.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "buyer")
public class Buyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    private Integer quantity;

    private Boolean isDelivery;

    private Integer isPaid;

    private LocalDateTime receivedAt;

    private Boolean isConfirmed;

    @OneToOne
    @JoinColumn(name = "review_id")
    private Review review;
}
