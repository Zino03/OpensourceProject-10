package com.example.saja_saja.service;

import com.example.saja_saja.dto.post.PostRequestDto;
import com.example.saja_saja.dto.post.PostResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.*;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BuyerService buyerService;
    private final AddressRepository addressRepository;

    public boolean isValidDeliveryFee(Boolean isDeliveryAvailable, Integer deliveryFee) {
        if(isDeliveryAvailable == true){
            if(deliveryFee <= 0){
                return false;
            }
        }
        return true;
    }

    @Transactional
    public ResponseEntity save(Member member, PostRequestDto postRequestDto, int quantity, BindingResult errors) {
        try {
            if(errors.hasErrors()) {
                Map<String, String> validatorResult = new HashMap<>();

                for (FieldError error : errors.getFieldErrors()) {
                    String validKeyName = String.format("valid_%s", error.getField());
                    validatorResult.put(validKeyName, error.getDefaultMessage());
                }

                return new ResponseEntity(validatorResult, HttpStatus.OK);
            }

            if(!isValidDeliveryFee(postRequestDto.getIsDeliveryAvailable(), postRequestDto.getDeliveryFee())) {
                throw new BadRequestException("배달비를 입력해주세요", null);
            }

            Post post = postRequestDto.toPost();

            Address address = null;
            if (post.getPickupAddress() != null) {
                address = addressRepository.save(post.getPickupAddress());
            }

            if(post.getIsDeliveryAvailable() == false) {
                post.setDeliveryFee(0);
            }

            post.setHost(member.getUser());
            post.setCreatedAt(LocalDateTime.now());
            post.setStatus(0);
            post.setPickupAddress(address);
            post.setCurrentQuantity(0);

            post = postRepository.save(post);

            buyerService.save(member, post, quantity);

            HashMap<String, Object> data = new HashMap<>();
            data.put("post", post);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("저장에 실패하였습니다.");
        }
    }

    public ResponseEntity post(Member member, long id) {
        Optional<Post> optional = postRepository.findById(id);
        if(optional.isPresent()) {
            PostResponseDto post = PostResponseDto.of(optional.get());

            System.out.println(member.getUser().getId());

            Buyer buyer = post.getBuyers().stream()
                    .filter(b -> (Objects.equals(b.getUser().getId(), member.getUser().getId())))
                    .findFirst()
                    .orElse(null);

            if(!Objects.equals(post.getHost().getId(), member.getUser().getId())) {
                post.setBuyers(null);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("post", post);
            data.put("buyer", buyer);
            return new ResponseEntity(data, HttpStatus.OK);
        } else {
            throw new ResourceNotFoundException("공동구매 게시글을 찾을 수 없습니다");
        }
    }
}
