package com.example.saja_saja.entity.member;

import com.example.saja_saja.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @OneToOne(mappedBy = "member", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private User user;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder
    public Member(String email, String password, User user, Role role) {
        this.email = email;
        this.password = password;
        this.user = user;
        this.role = role;

        if (user != null) {
            user.setMember(this);
        }
    }
}
