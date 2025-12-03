package com.example.saja_saja.service;

import com.example.saja_saja.dto.user.*;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.MemberRepository;
import com.example.saja_saja.entity.user.*;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Transactional
@Service
@RequiredArgsConstructor
public class UserService {
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageService imageService;

    public Member getMember(Long userId) {
        try {
            if(userId==null) throw new Exception();
            return memberRepository.findById(userId).get();
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Boolean isEmailDuplicated(String email) {
        return memberRepository.existsByEmail(email);
    }

    public Boolean isPhoneDuplicated(String phone) {
        return userRepository.existsByPhone(phone);
    }

    public Boolean isNicknameDuplicated(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    public ResponseEntity getAddressList(Long userId) {
        try {
            List<UserAddress> addresses = userAddressRepository.findByUserId(userId);
            List<UserAddressResponseDto> addressDto = addresses.stream()
                    .map(UserAddressResponseDto::new)
                    .collect(Collectors.toList());

            HashMap<String, Object> data = new HashMap<>();
            data.put("addresses", addressDto);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("배송지 정보를 불러올 수 없습니다.");
        }
    }

    public ResponseEntity addAddress(Long userId, UserAddressRequestDto req) {
        final Integer MAX_ADDRESS_COUNT = 5;

        try {
            User user = userRepository.findById(userId).get();

            Long currentAddressCount = userAddressRepository.countByUser(user);

            if (currentAddressCount >= MAX_ADDRESS_COUNT) {
                HashMap<String, Object> errorData = new HashMap<>();
                errorData.put("error", "AddressLimitExceeded");
                errorData.put("message", "배송지는 최대 " + MAX_ADDRESS_COUNT + "개까지만 등록할 수 있습니다.");

                return new ResponseEntity<>(errorData, HttpStatus.BAD_REQUEST);
            }

            UserAddress newAddress = req.toUserAddress(user);

            if (!newAddress.getEntranceAccess().equals(EntranceAccess.FREE)) {
                if (newAddress.getEntranceDetail() == null || newAddress.getEntranceDetail().isEmpty()) {
                    throw new BadRequestException("공동현관 출입방법 상세내용을 입력하세요.", null);
                }
            }

            if (newAddress.getIsDefault()) {
                Optional<UserAddress> currentDefault = userAddressRepository.findByUserAndIsDefaultTrue(user);

                currentDefault.ifPresent(address -> {
                    address.setIsDefault(false);
                    userAddressRepository.save(address);
                });
            } else {
                if (currentAddressCount == 0) {
                    newAddress.setIsDefault(true);
                }
            }

            UserAddress savedAddress = userAddressRepository.save(newAddress);

            UserAddressResponseDto savedAddressDto = new UserAddressResponseDto(savedAddress);

            HashMap<String, Object> data = new HashMap<>();
            data.put("address", savedAddressDto);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("배송지 등록 실패하였습니다.");
        }
    }

    public ResponseEntity updateUserAddress(Long userId, Long addressId, UserAddressRequestDto addressDto) {
        try {
            User user = userRepository.findById(userId).get();
            Long currentAddressCount = userAddressRepository.countByUser(user);

            UserAddress userAddress = userAddressRepository.findById(addressId)
                    .orElseThrow(() -> new ResourceNotFoundException("배송지를 찾을 수 없습니다"));

            if (addressDto.getName() != null) userAddress.setName(addressDto.getName());
            if (addressDto.getRecipient() != null) userAddress.setRecipient(addressDto.getRecipient());
            if (addressDto.getPhone() != null) userAddress.setPhone(addressDto.getPhone());
            if (addressDto.getZipCode() != null) userAddress.setZipCode(addressDto.getZipCode());
            if (addressDto.getStreet() != null) userAddress.setStreet(addressDto.getStreet());
            if (addressDto.getDetail() != null) userAddress.setDetail(addressDto.getDetail());
            if (addressDto.getEntranceAccess() != null) userAddress.setEntranceAccess(addressDto.getEntranceAccess());
            if (addressDto.getEntranceDetail() != null) userAddress.setEntranceDetail(addressDto.getEntranceDetail());
            if (addressDto.getIsDefault() != null) {
                if (addressDto.getIsDefault()) {
                    Optional<UserAddress> currentDefault = userAddressRepository.findByUserAndIsDefaultTrue(user);

                    currentDefault.ifPresent(address -> {
                        address.setIsDefault(false);
                        userAddressRepository.save(address);
                    });
                } else {
                    if (currentAddressCount == 0) {
                        addressDto.setIsDefault(true);
                    }
                }

                userAddress.setIsDefault(addressDto.getIsDefault());
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("address", UserAddressResponseDto.of(userAddress));
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("변경에 실패하였습니다.");
        }
    }

    public ResponseEntity deleteUserAddress(Long userId, Long addressId) {
        try {
            UserAddress address = userAddressRepository.findById(addressId)
                    .orElseThrow(() -> new ResourceNotFoundException("배송지 정보를 찾을 수 없습니다."));

            if (!address.getUser().getId().equals(userId)) {
                throw new SecurityException("다른 사용자의 배송지 정보는 삭제할 수 없습니다.");
            }

            userAddressRepository.delete(address);

            if (address.getIsDefault()) {
                userAddressRepository.findTopByUserAndIsDefaultFalseOrderByIdAsc(address.getUser())
                        .ifPresent(newDefault -> {
                            newDefault.setIsDefault(true);
                            userAddressRepository.save(newDefault);
                        });
            }

            Map<String, Object> message = new HashMap<>();
            message.put("message", "배송지가 삭제되었습니다.");
            return new ResponseEntity(message, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (SecurityException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("배송지 삭제에 실패하였습니다.");
        }
    }


    @Transactional
    public ResponseEntity updateUserInfo(Member member, UserRequestDto req, MultipartFile image) {
        try {
            Long userId = member.getUser().getId();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("사용자 정보를 찾을 수 없습니다."));

            Integer updateCnt = 0;

            if (req.getPassword() != null && !req.getPassword().isEmpty()) {
                String hashedPassword = passwordEncoder.encode(req.getPassword());
                member.setPassword(hashedPassword);
                updateCnt++;
            }

            if (req.getEmail() != null && !req.getEmail().isEmpty()) {
                member.setEmail(req.getEmail());
                updateCnt++;
            }

            if (req.getNickname() != null && !req.getNickname().isEmpty()) {
                user.setNickname(req.getNickname());
                updateCnt++;
            }
            if (image != null && !image.isEmpty()) {
                user.setProfileImg(imageService.uploadProfileImage(image));
                updateCnt++;
            }
            if (req.getAccountBank() != null && !req.getAccountBank().isEmpty()) {
                user.setAccountBank(req.getAccountBank());
                updateCnt++;
            }
            if (req.getAccount() != null && !req.getAccount().isEmpty()) {
                user.setAccount(req.getAccount());
                updateCnt++;
            }

            if (updateCnt == 0) {
                HashMap<String, Object> data = new HashMap<>();
                data.put("message", "수정된 정보가 없습니다.");
                return new ResponseEntity(data, HttpStatus.OK);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("user", UserResponseDto.of(user));
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("변경에 실패하였습니다.");
        }
    }

    public ResponseEntity getProfile(Member member, String nickname) {
        try {
            User user = userRepository.findByNickname(nickname)
                    .orElseThrow(() -> new ResourceNotFoundException("해당 사용자를 찾을 수 없습니다."));

            ProfileResponseDto profile = null;
            if (member != null && member.getUser().getNickname().equals(nickname)) {
                profile = ProfileResponseDto.of(user, true);
            } else {
                profile = ProfileResponseDto.of(user, false);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("profile", profile);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("프로필을 불러올 수 없습니다.");
        }
    }

    public ResponseEntity getUser(Member member) {
        try {
            User user = member.getUser();

            UserInfoResponseDto profile = null;
            if (member != null) {
                profile = UserInfoResponseDto.of(user);
            } else {
                throw new BadRequestException("로그인되지 않은 사용자입니다.", null);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("profile", profile);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("프로필을 불러올 수 없습니다.");
        }
    }
}