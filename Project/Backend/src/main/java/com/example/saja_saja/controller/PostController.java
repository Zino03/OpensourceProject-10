package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.post.*;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.Category;
import com.example.saja_saja.entity.post.PostRepository;
import com.example.saja_saja.service.BuyerService;
import com.example.saja_saja.service.PostService;
import com.example.saja_saja.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserService userService;
    private final BuyerService buyerService;
    private final PostRepository postRepository;

    @PostMapping("/posts")
    public ResponseEntity<?> save(
            @Valid @RequestBody PostWithQuantityRequestDto req,
            BindingResult errors
    ) {
        Map<String, Object> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        PostRequestDto postDto = req.getPost();
        if (postDto != null) {
            if (Boolean.TRUE.equals(postDto.getIsDeliveryAvailable())) {
                if (postDto.getDeliveryFee() == null || postDto.getDeliveryFee() <= 0) {
                    validatorResult.put("valid_deliveryFee", "배달비를 0보다 크게 입력해 주세요.");
                }
            }
        } else {
            validatorResult.put("valid_post", "게시글 정보가 없습니다.");
        }

        if (!validatorResult.isEmpty()) {
            validatorResult.put("data", req);
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.save(member, req.getPost(), req.getQuantity());
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<?> post(@PathVariable long id) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.post(member, id);
    }

    @GetMapping("/posts")
    public ResponseEntity<?> posts(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "0") int type,
                                   @RequestParam(required = false) Category category) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
        return postService.postList(pageable, type, category);
    }

    @GetMapping("/posts/map")
    public ResponseEntity<?> postsMap(
            @RequestParam double lat,      // 현재 위도
            @RequestParam double lon,      // 현재 경도
            @RequestParam(defaultValue = "0") int page
    ) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "id"));
        return postService.postListForMap(pageable, lat, lon);
    }

    @GetMapping("/posts/{id}/buyers")
    public ResponseEntity<?> buyers(@PathVariable long id) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.buyerList(member, id);
    }

    @PostMapping("/posts/{id}/buyers")
    public ResponseEntity<?> apply(
            @PathVariable long id,
            @Valid @RequestBody BuyerApplyRequestDto req,
            BindingResult errors
    ) {
        Map<String, Object> validatorResult = new HashMap<>();

        if (errors.hasErrors()) {
            for (FieldError error : errors.getFieldErrors()) {
                String validKeyName = String.format("valid_%s", error.getField());
                validatorResult.put(validKeyName, error.getDefaultMessage());
            }
        }

        // 배송일 경우 userAddressId 필수
        if (Boolean.TRUE.equals(req.getIsDelivery()) && req.getUserAddressId() == null) {
            validatorResult.put("valid_userAddressId", "배송지를 선택해주세요.");
        }

        if (!validatorResult.isEmpty()) {
            validatorResult.put("data", req);
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.save(member, id, req);
    }

    // 공구 취소
    @PostMapping("/posts/{id}/cancel")
    public ResponseEntity<?> cancelPost(@PathVariable long id) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return postService.cancel(member.getUser(), id);
    }

    // 공구 신청 취소(단순 변심)
    @PostMapping("/posts/{id}/cancel-apply")
    public ResponseEntity<?> cancelBuyer(@PathVariable long id) {
        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.cancel(member.getUser(), id, 0);
    }

    // 주최자 수량 변경
    @PostMapping("/post/{id}/host-quantity")
    public ResponseEntity<?> updateHostQuantity(
            @PathVariable long id,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        if (quantity <= 0) {
            Map<String, String> validatorResult = new HashMap<>();
            validatorResult.put("valid_quantity", "수량은 1개 이상이어야 합니다.");
            return new ResponseEntity<>(validatorResult, HttpStatus.OK);
        }

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.update(member, id, quantity);
    }

    // 운송장 update
    @PostMapping("/posts/{id}/tracking")
    public ResponseEntity<?> trackingNumberUpdate(
            @PathVariable long id,
            @Valid @RequestBody TrackingNumberRequestDto req,
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

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.trackingNumberUpdate(member, id, req);
    }

    // 수령일자 update
    @PostMapping("/posts/{id}/received-at")
    public ResponseEntity<?> receivedAtUpdate(
            @PathVariable long id,
            @Valid @RequestBody ReceivedAtRequestDto req,
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

        Member member = userService.getMember(SecurityUtil.getCurrentUserId());
        return buyerService.receivedAtUpdate(member, id, req);
    }



    @PostMapping("/posts/update-status")
    public void updateType() {
        postService.postUpdateType();
    }
}
