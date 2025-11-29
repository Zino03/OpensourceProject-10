package com.example.saja_saja.service;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.BuyerRepository;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.user.UserAddress;
import com.example.saja_saja.entity.user.UserAddressRepository;
import com.example.saja_saja.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BuyerService {
    private final BuyerRepository buyerRepository;
    private final UserAddressRepository userAddressRepository;

    public ResponseEntity save(Member member, Post post, int requestQuantity) {
        return this.save(member, post, false, null, requestQuantity);
    }

    // TODO: 구매자 취소
    // TODO: 주최자가 수량 변경
    public ResponseEntity update(Member member, Post post, int requestQuantity) {
        Buyer buyer = buyerRepository.findByUser(member.getUser());

        return new ResponseEntity(buyer, HttpStatus.OK);
    }

    // TODO: 배송지 확인
    public ResponseEntity save(Member member, Post post, boolean isDelivery, Long userAddressId, int requestQuantity) {
        int currentQuantity = post.getCurrentQuantity();
        int targetQuantity = post.getQuantity();

        Map<String, Object> body = new HashMap<>();

        body.put("currentQuantity", currentQuantity);
        body.put("requestQuantity", requestQuantity);
        body.put("targetQuantity", targetQuantity);

        if (currentQuantity + requestQuantity > targetQuantity) {
            throw new BadRequestException(
                    "신청 수량이 초과되었습니다. (현재 " + currentQuantity + " / 신청 " + requestQuantity + " / 목표 " + targetQuantity + ")",
                    body
            );
        }

        LocalDateTime now = LocalDateTime.now();
        switch (post.getStatus()) {
            case 0: case 4:
                if(!post.getHost().equals(member.getUser())) {
                    throw new BadRequestException("신청할 수 없는 게시글입니다.", null);                }

            case 1: case 2:
                if(now.isAfter(post.getEndAt())) {
                    throw new BadRequestException("마감된 게시글입니다.", null);
                }
                break;
            case 3:
                throw new BadRequestException("마감된 게시글입니다.", null);
            default:
        }

        if(post.getIsDeliveryAvailable() == false && isDelivery == true) {
            throw new BadRequestException("배송신청이 불가능한 게시글입니다.", null);
        }

        Buyer buyer = Buyer.builder()
                .user(member.getUser())
                .post(post)
                .isDelivery(isDelivery)
                .quantity(requestQuantity)
                .createdAt(LocalDateTime.now())
                .isPaid(0)
                .isCanceled(false)
                .status(0)
                .build();

        if(isDelivery == true) {
            if(userAddressId == null) {
                throw new BadRequestException("배송지가 없습니다.", null);
            }
            Optional<UserAddress> userAddress = userAddressRepository.findByUserAndId(member.getUser(), userAddressId);

            if(userAddress.isEmpty()) {
                throw new BadRequestException("배송지를 찾을 수 없습니다.", null);
            }

            UserAddress newUserAddress = new UserAddress();
            BeanUtils.copyProperties(userAddress.get(), newUserAddress);
            newUserAddress.setId(null);
            newUserAddress = userAddressRepository.save(newUserAddress);
            buyer.setUserAddress(newUserAddress);
        }

        if(post.getHost().equals(member.getUser())) {
            buyer.setIsPaid(1);
            buyer.setStatus(1);
        }

        post.getBuyers().add(buyer);
        post.setCurrentQuantity(post.getCurrentQuantity() + buyer.getQuantity());

        buyer = buyerRepository.save(buyer);

        return new ResponseEntity(buyer, HttpStatus.OK);
    }

    // TODO: buyer list 가져오기

    // TODO: 운송장 update

    // TODO: 취소 여부 update
}
