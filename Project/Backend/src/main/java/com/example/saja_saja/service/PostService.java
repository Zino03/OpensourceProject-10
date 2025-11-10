package com.example.saja_saja.service;

import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BuyerRepository buyerRepository;
    private final AddressRepository addressRepository;

    public ResponseEntity save(Member member, Post res, int quantity) {
        try {
            Address address = null;
            if (res.getPickupAddress() != null) {
                address = addressRepository.save(res.getPickupAddress());
            }

            res.setHost(member.getUser());
            res.setCreatedAt(LocalDateTime.now());
            res.setStatus(0);
            res.setPickupAddress(address);

            Post post = postRepository.save(res);

            Buyer buyer = Buyer.builder()
                    .user(member.getUser())
                    .post(post)
                    .isDelivery(false)
                    .quantity(quantity)
                    .isPaid(1)
                    .receivedAt(null)
                    .isConfirmed(true)
                    .build();

            buyerRepository.save(buyer);

            post.getBuyers().add(buyer);

            HashMap<String, Object> data = new HashMap<>();
            data.put("post", post);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
