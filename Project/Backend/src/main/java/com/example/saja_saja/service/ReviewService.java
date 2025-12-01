package com.example.saja_saja.service;

import com.example.saja_saja.dto.post.NoticeRequestDto;
import com.example.saja_saja.dto.post.ReviewRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.*;
import com.example.saja_saja.exception.BadRequestException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final PostRepository postRepository;
    private final BuyerRepository buyerRepository;

    @Transactional
    public ResponseEntity save(Member member, Long postId, ReviewRequestDto reviewRequestDto) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("주최자는 후기를 등록할 수 없습니다.", null);
        }

        Optional<Buyer> optionalB = buyerRepository.findByUserAndPostAndIsCanceled(member.getUser(), post, false);

        if (optionalB.isEmpty()) {
            throw new BadRequestException("해당 사용자의 구매 정보가 없습니다.", null);
        }

        Buyer buyer = optionalB.get();

        if(buyer.getReview()!=null) {
            throw new BadRequestException("이미 등록된 후기가 있습니다.", null);
        }

        if(buyer.getStatus() != 5) {
            throw new BadRequestException("구매 확정 후에 후기를 작성할 수 있습니다.", null);
        }

        Review review = Review.builder()
                .buyer(buyer)
                .createdAt(LocalDateTime.now())
                .content(reviewRequestDto.getContent())
                .star(reviewRequestDto.getStar())
                .isBanned(Boolean.FALSE)
                .build();

        post.getHost().setTotalStar(post.getHost().getTotalStar()+review.getStar());
        post.getHost().setReceivedReviewCount(post.getHost().getReceivedReviewCount()+1);

        review = reviewRepository.save(review);
        buyer.setReview(review);

        return null;
    }
}
