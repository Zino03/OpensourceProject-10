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

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BuyerService {
    private final BuyerRepository buyerRepository;

    public ResponseEntity save(Member member, Post post, int requestQuantity) {
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

        Buyer buyer = Buyer.builder()
                .user(member.getUser())
                .post(post)
                .isDelivery(false)
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
