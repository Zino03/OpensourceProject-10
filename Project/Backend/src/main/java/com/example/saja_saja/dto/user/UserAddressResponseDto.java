package com.example.saja_saja.dto.user;

import com.example.saja_saja.entity.user.EntranceAccess;
import com.example.saja_saja.entity.user.UserAddress;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAddressResponseDto {
    private Long id;

    private String name;

    private String recipient;

    private String phone;

    private Integer zipCode;

    private String street;

    private String detail;

    private EntranceAccess entranceAccess;

    private String entranceDetail;

    private Boolean isDefault;


    public UserAddressResponseDto(UserAddress userAddress) {
        this.id = userAddress.getId();
        this.name = userAddress.getName();
        this.recipient = userAddress.getRecipient();
        this.phone = userAddress.getPhone();
        this.zipCode = userAddress.getZipCode();
        this.street = userAddress.getStreet();
        this.detail = userAddress.getDetail();
        this.entranceAccess = userAddress.getEntranceAccess();
        this.entranceDetail = userAddress.getEntranceDetail();
        this.isDefault = userAddress.getIsDefault();
    }

    public static UserAddressResponseDto of(UserAddress userAddress) {
        return new UserAddressResponseDto().builder()
                .id(userAddress.getId())
                .name(userAddress.getName())
                .recipient(userAddress.getRecipient())
                .phone(userAddress.getPhone())
                .zipCode(userAddress.getZipCode())
                .street(userAddress.getStreet())
                .detail(userAddress.getDetail())
                .entranceAccess(userAddress.getEntranceAccess())
                .entranceDetail(userAddress.getEntranceDetail())
                .isDefault(userAddress.getIsDefault())
                .build();
    }

}
