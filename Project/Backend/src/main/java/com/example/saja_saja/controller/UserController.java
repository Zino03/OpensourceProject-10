package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.post.ReviewRequestDto;
import com.example.saja_saja.dto.user.UserAddressRequestDto;
import com.example.saja_saja.dto.user.UserRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.BuyerRepository;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.service.BuyerService;
import com.example.saja_saja.service.PostService;
import com.example.saja_saja.service.ReviewService;
import com.example.saja_saja.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final BuyerService buyerService;
    private final BuyerRepository buyerRepository;
    private final ReviewService reviewService;
    private final PostService postService;

    @GetMapping("/check/email")
    public Boolean checkEmail(
            @NotBlank(message = "이메일은 필수 입력값입니다.")
            @Email(message = "올바른 이메일 주소를 입력해주세요.")
            @RequestParam("value") String email) {
        return userService.isEmailDuplicated(email);
    }

    @GetMapping("/check/phone")
    public Boolean checkPhone(
            @NotBlank(message = "전화번호는 필수 입력값입니다.")
            @RequestParam("value") String phone) {
        return userService.isPhoneDuplicated(phone);
    }

    @GetMapping("/check/nickname")
    public Boolean checkNickname(
            @Size(min = 1, max = 10, message = "닉네임은 1자 이상 10자 이하입니다.")
            @NotBlank(message = "닉네임을 입력해 주세요.")
            @RequestParam("value") String nickname) {
        return userService.isNicknameDuplicated(nickname);
    }

    @GetMapping("/user/{nickname}")
    public ResponseEntity getProfile(@PathVariable String nickname) {
        return userService.getProfile(nickname);
    }

    @PutMapping(
            value = "/mypage/user",
            consumes = { "multipart/form-data" }
    )
    public ResponseEntity updateUserInfo(@RequestPart(value = "user", required = false) UserRequestDto req,
                                         @RequestPart(value = "image", required = false) MultipartFile image) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return userService.updateUserInfo(member, req, image);
    }

    @GetMapping("/mypage/addresses")
    public ResponseEntity getAddresses() {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.getAddressList(userId);
    }

    @PostMapping("/mypage/address")
    public ResponseEntity addUserAddress(
            @Valid @RequestBody UserAddressRequestDto req,
            BindingResult errors
    ) {
        Map<String, Object> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        if (!validatorResult.isEmpty()) {
            validatorResult.put("data", req);
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.addAddress(userId, req);
    }

    @PutMapping("/mypage/address/{addressId}")
    public ResponseEntity updateUserAddress(@PathVariable Long addressId, @RequestBody UserAddressRequestDto addressDto) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.updateUserAddress(userId, addressId, addressDto);
    }

    @DeleteMapping("/mypage/address/{addressId}")
    public ResponseEntity deleteUserAddress(@PathVariable Long addressId) {
        Long userId = userService.getMember(SecurityUtil.getCurrentUserId()).getUser().getId();
        return userService.deleteUserAddress(userId, addressId);
    }

    // 주문내역 조회
    @GetMapping("/mypage/orders")
    public ResponseEntity getOrderList(
            // 0: 주문 접수, 1: 결제완료, 2: 상품 준비중, 3: 배송중, 4: 수령 완료, 5: 주문 취소
            @RequestParam(required = false, defaultValue = "0") Integer status,
            @PageableDefault(page = 0, size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.orderList(member, status, pageable);
    }

    // 주문 상세
    @GetMapping("/mypage/order/{buyerId}")
    public ResponseEntity getOrder(@PathVariable Long buyerId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.order(member, buyerId);
    }

    // 주문 취소 (단순 변심)
    @PutMapping("/mypage/order/{buyerId}/cancel")
    public ResponseEntity cancelOrder(@PathVariable Long buyerId) {
        User user = userService.getMember(SecurityUtil.getCurrentUserId()).getUser();
        Long postId = buyerRepository.findById(buyerId).get().getPost().getId();
        return buyerService.cancel(user, postId, 0);
    }

    // 구매확정
    @PutMapping("/mypage/order/{buyerId}/confirm")
    public ResponseEntity confirmOrder(@PathVariable Long buyerId) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.confirmPurchase(member, buyerId);
    }

    // 후기 작성
    @PostMapping("/mypage/order/{buyerId}/review")
    public ResponseEntity review(
            @PathVariable Long buyerId,
            @RequestBody ReviewRequestDto req
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        Long postId = buyerRepository.findById(buyerId).get().getPost().getId();
        return reviewService.save(member, postId, req);
    }

    // 주최 공구 조회
    @GetMapping("/mypage/posts")
    public ResponseEntity getPostList(
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.userPostList(pageable, member, member.getUser().getNickname());
    }
}
