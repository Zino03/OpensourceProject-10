package com.example.saja_saja.service;

import com.example.saja_saja.dto.post.PostListResponseDto;
import com.example.saja_saja.dto.post.PostRequestDto;
import com.example.saja_saja.dto.post.PostResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.*;
import com.example.saja_saja.entity.user.User;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BuyerService buyerService;
    private final AddressRepository addressRepository;

    // 공구 생성 + host 본인 buyer 생성
    @Transactional
    public ResponseEntity save(Member member, PostRequestDto postRequestDto, int quantity) {
        try {
            if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
                throw new BadRequestException("이용이 정지된 사용자입니다.", null);
            }

            Post post = postRequestDto.toPost();

            // 배송 불가면 배달비 0원
            if (Boolean.FALSE.equals(postRequestDto.getIsDeliveryAvailable())) {
                post.setDeliveryFee(0);
            }
            post.setHost(member.getUser());

            Address address = addressRepository.save(postRequestDto.getPickupAddress());
            post.setPickupAddress(address);

            post = postRepository.save(post);

            // host도 buyer로 자동 참여
            buyerService.save(member, post.getId(), quantity);

            HashMap<String, Object> data = new HashMap<>();
            data.put("post", post);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (InternalAuthenticationServiceException e) {
            if (e.getCause() instanceof BadRequestException bre) {
                throw bre;
            }
            throw e; // 나머지는 그대로
        }
    }

    public ResponseEntity post(Member member, long id) {
        Post postEntity = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공동구매 게시글을 찾을 수 없습니다"));

        PostResponseDto post = PostResponseDto.of(postEntity);

        HashMap<String, Object> data = new HashMap<>();

        if (member == null) {
            if (post.getStatus().equals(0)||post.getStatus().equals(4)) {
                throw new BadRequestException("확인할 수 없는 공동구매 게시글입니다.", null);
            }
            // 로그인 안 했으면 buyers 감추기
            post.setBuyers(null);
        }

        if(member != null && !post.getHost().equals(member.getUser())) {
            if (post.getStatus().equals(0)||post.getStatus().equals(4)) {
                throw new BadRequestException("확인할 수 없는 공동구매 게시글입니다.", null);
            }

            // 내가 이 공구에 참여했는지 여부
            Buyer buyer = post.getBuyers().stream()
                    .filter(b -> Objects.equals(b.getUser().getId(), member.getUser().getId()))
                    .findFirst()
                    .orElse(null);

            data.put("buyer", buyer);
            // 로그인 안 했으면 buyers 감추기
            post.setBuyers(null);
        }

        if (post.getIsCanceled().equals(Boolean.TRUE)) {
            post.setBuyers(null);
        }

        List<Review> reviews = post.getBuyers().stream()
                .map(Buyer::getReview)
                .filter(Objects::nonNull)
                .toList();

        if (!reviews.isEmpty()) {
            post.setReviews(reviews);
        }

        data.put("post", post);
        return new ResponseEntity(data, HttpStatus.OK);
    }

    //TODO : isCanceled check
    public ResponseEntity postList(Pageable pageable, Integer type, Category category) {
        Specification<Post> spec = (root, query, cb) -> null;

        if (type == 0) {
            // 진행중, 마감임박, 마감
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

        // 취소되지 않은 공구만
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("isCanceled"), false)
        );

        // 카테고리 필터 (null일 때는 전체)
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

    //TODO : check - 공구 자체 취소 (주최자만)
    @Transactional
    public ResponseEntity cancel(User user, long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("공동구매 게시글을 찾을 수 없습니다"));

        if (!post.getHost().equals(user)) {
            throw new BadRequestException("주최한 공구가 아닙니다", null);
        }

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("이미 취소된 공동구매 게시글입니다.", null);
        }

        if (post.getStatus().equals(4)) {
            throw new BadRequestException("반려된 공동구매 게시글입니다.", null);
        }

        post.setIsCanceled(true);

        // 참여자 전부에 대해 buyer 취소 처리
        for (Buyer buyer : post.getBuyers()) {
            buyerService.cancel(buyer.getUser(), postId, 1);
        }

        postRepository.save(post);
        return new ResponseEntity("공구 취소가 완료되었습니다.", HttpStatus.OK);
    }

    @Transactional
//    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul") // 매일 0시 실행
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
