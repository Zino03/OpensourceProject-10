package com.example.saja_saja.dto.user;

import com.example.saja_saja.entity.user.EntranceAccess;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAddressRequestDto {
    @NotBlank(message = "배송지명을 입력하세요.")
    private String name;

    @NotBlank(message = "받는분을 입력하세요.")
    private String recipient;

    @NotBlank(message = "전화번호를 입력하세요.")
    private String phone;

    @NotNull(message = "우편번호를 입력하세요.")
    private Integer zipCode;

    @NotBlank(message = "도로명주소을 입력하세요.")
    private String street;

    @NotBlank(message = "상세주소을 입력하세요.")
    private String detail;

    @NotNull(message = "공동현관 출입방법을 선택하세요.")
    private EntranceAccess entranceAccess;

    @NotBlank(message = "공동현관 출입방법 상세내용을 입력하세요.")
    private String entranceDetail;

    @NotNull(message = "개본배송지 설정 여부를 선택하세요.")
    private Boolean isDefault;

    public UserAddress toUserAddress(User user) {
        return UserAddress.builder()
                .name(name)
                .recipient(recipient)
                .phone(phone)
                .zipCode(zipCode)
                .street(street)
                .detail(detail)
                .entranceAccess(entranceAccess)
                .entranceDetail(entranceDetail)
                .isDefault(isDefault)
                .user(user)
                .build();
    }
}
