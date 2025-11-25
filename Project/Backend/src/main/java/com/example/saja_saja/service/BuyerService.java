package com.example.saja_saja.service;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.Buyer;
import com.example.saja_saja.entity.post.BuyerRepository;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BuyerService {
    private final BuyerRepository buyerRepository;

    public ResponseEntity save(Member member, Post post, int requestQuantity) {
        return this.save(member, post, false, requestQuantity);
    }

    public ResponseEntity save(Member member, Post post, boolean isDelivery, int requestQuantity) {
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
                .isPaid(1)
                .receivedAt(null)
                .isConfirmed(true)
                .build();

        post.getBuyers().add(buyer);
        post.setCurrentQuantity(post.getCurrentQuantity() + buyer.getQuantity());

        buyer = buyerRepository.save(buyer);

        return new ResponseEntity(buyer, HttpStatus.OK);
    }
}
