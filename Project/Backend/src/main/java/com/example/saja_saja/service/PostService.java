package com.example.saja_saja.service;

import com.example.saja_saja.dto.post.AdminPostListResponseDto;
import com.example.saja_saja.dto.post.PostListResponseDto;
import com.example.saja_saja.dto.post.PostRequestDto;
import com.example.saja_saja.dto.post.PostResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.*;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BuyerService buyerService;
    private final AddressRepository addressRepository;

    public boolean isValidDeliveryFee(Boolean isDeliveryAvailable, Integer deliveryFee) {
        if(isDeliveryAvailable){
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

            if (postRequestDto.getPickupAddress() == null) {
                throw new BadRequestException("주소를 입력해주세요", null);
            }

            Post post = postRequestDto.toPost();

            if(postRequestDto.getIsDeliveryAvailable() == false) {
                post.setDeliveryFee(0);
            }

            post.setHost(member.getUser());

            Address address = addressRepository.save(postRequestDto.getPickupAddress());
            post.setPickupAddress(address);

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

    //TODO: reviews check
    public ResponseEntity post(Member member, long id) {
        Optional<Post> optional = postRepository.findById(id);
        if(optional.isPresent()) {
            PostResponseDto post = PostResponseDto.of(optional.get());

            HashMap<String, Object> data = new HashMap<>();

            List<Review> reviews = post.getBuyers().stream()
                    .map(Buyer::getReview)
                    .filter(Objects::nonNull)   // << null 제거!
                    .toList();

            if (!reviews.isEmpty()) {
                post.setReviews(reviews);
            }

            if(member != null) {
                Buyer buyer = post.getBuyers().stream()
                        .filter(b -> (Objects.equals(b.getUser().getId(), member.getUser().getId())))
                        .findFirst()
                        .orElse(null);

                if(!Objects.equals(post.getHost().getNickname(), member.getUser().getNickname())) {
                    post.setBuyers(null);
                }

                data.put("buyer", buyer);
            } else {
                post.setBuyers(null);
            }

            data.put("post", post);
            return new ResponseEntity(data, HttpStatus.OK);
        } else {
            throw new ResourceNotFoundException("공동구매 게시글을 찾을 수 없습니다");
        }
    }

    //TODO : isCanceled check
    public ResponseEntity postList(Pageable pageable, Integer type, Category category) {
        Specification<Post> spec = (root, query, cb) -> null;

        // 상태 필터
        if (type == 0) {
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("status"), 1, 3)
            );
        } else if (type >= 1 && type <= 3) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), type)
            );
        } else {
            throw new BadRequestException("잘못된 타입입니다.", null);
        }

        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("isCanceled"), false)
        );

        // 카테고리 필터 (null일 때는 조건 없음)
        if (category != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("category"), category)
            );
        }

        List<PostListResponseDto> postList = postRepository.findAll(spec, pageable)
                .stream()
                .map(PostListResponseDto::of)
                .toList();

        return new ResponseEntity(postList, HttpStatus.OK);
    }

    //TODO : check
    public ResponseEntity cancel(Member member, long id) {
        Post post = postRepository.findById(id).get();
        if(!post.getHost().equals(member.getUser())) {
            throw new BadRequestException("주최한 공구가 아닙니다", null);
        }
        post.setIsCanceled(true);
        postRepository.save(post);
        return new ResponseEntity("공구 취소가 완료되었습니다.", HttpStatus.OK);
    }

//    public

    @Transactional
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul") // 매일 0시 실행
    public void postUpdateType() {
        LocalDateTime now = LocalDateTime.now();

        List<Post> posts = postRepository.findAll();

        for (Post p : posts) {
            if (p.getStatus() == 2 || p.getStatus() == 3) {
                LocalDateTime endAt = p.getEndAt();

                if (now.isAfter(endAt)) {
                    // 마감
                    p.setStatus(3);
                } else {
                    // endAt 30일 전 ~ endAt 사이면 마감임박
                    if (!now.isBefore(endAt.minusDays(30)) && !now.isAfter(endAt)) {
                        p.setStatus(2);
                    }
                }
            }
        }

        postRepository.saveAll(posts);
    }
}
