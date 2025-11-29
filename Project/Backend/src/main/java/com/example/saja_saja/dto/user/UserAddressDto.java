package com.example.saja_saja.dto.user;

import com.example.saja_saja.entity.user.EntranceAccess;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.entity.user.UserAddress;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAddressDto {
    private Long id;

    private String name;

    private String recipient;

    private String phone;

    private String street;

    private String detail;

    private EntranceAccess entranceAccess;

    private String entranceDetail;

    private Boolean isDefault;

    public UserAddressDto(UserAddress userAddress) {
        this.id = userAddress.getId();
        this.name = userAddress.getName();
        this.recipient = userAddress.getRecipient();
        this.phone = userAddress.getPhone();
        this.street = userAddress.getStreet();
        this.detail = userAddress.getDetail();
        this.entranceAccess = userAddress.getEntranceAccess();
        this.entranceDetail = userAddress.getEntranceDetail();
        this.isDefault = userAddress.getIsDefault();
    }

    public static UserAddressDto of(UserAddress userAddress) {
        return new UserAddressDto().builder()
                .id(userAddress.getId())
                .name(userAddress.getName())
                .recipient(userAddress.getRecipient())
                .phone(userAddress.getPhone())
                .street(userAddress.getStreet())
                .detail(userAddress.getDetail())
                .entranceAccess(userAddress.getEntranceAccess())
                .entranceDetail(userAddress.getEntranceDetail())
                .isDefault(userAddress.getIsDefault())
                .build();
    }

    public UserAddress toUserAddress(User user) {
        return UserAddress.builder()
                .name(name)
                .recipient(recipient)
                .phone(phone)
                .street(street)
                .detail(detail)
                .entranceAccess(entranceAccess)
                .entranceDetail(entranceDetail)
                .isDefault(isDefault)
                .user(user)
                .build();
    }
}
