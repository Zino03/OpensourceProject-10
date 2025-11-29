package com.example.saja_saja.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDto {
    private String email;

    private String password;

    private String nickname;

    private String profileImg;

    private String account;
}
