package com.example.saja_saja.entity.user;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.report.ReviewReport;
import com.example.saja_saja.entity.report.UserReport;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String nickname;

    private String phone;

    private String profileImg;

    private String address;

    private String account;

    private String virtualAccount;

    @Column(nullable = false)
    private Double mannerScore = 0.0;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    @JsonIgnore
    private Member member;

    @OneToMany(mappedBy = "host")
    @JsonIgnore
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "reporter")
    @JsonIgnore
    private List<UserReport> userReports = new ArrayList<>();

    @OneToMany(mappedBy = "reporter")
    @JsonIgnore
    private List<ReviewReport> reviewReports = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Buyer> buyers = new ArrayList<>();
}
