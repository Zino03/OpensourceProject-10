package com.example.saja_saja.dto.post;

import com.example.saja_saja.entity.post.Category;
import com.example.saja_saja.entity.post.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MyPostListResponseDto {
    private Long id;

    private String title;

    private String image;

    private Integer price;

    private LocalDateTime endAt;

    private Integer status;

    private Integer quantity;

    private Integer currentQuantity;

//현재 참여 인원)

    public static MyPostListResponseDto of(Post post) {
        return MyPostListResponseDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .image(post.getImage())
                .price(post.getPrice())
                .endAt(post.getEndAt())
                .status(post.getStatus())
                .quantity(post.getQuantity())
                .currentQuantity(post.getQuantity())
                .build();
    }

//[주최공구 추가 필요]
//            - 참여자 목록
//-> 참여자 닉네임
//- 참여 상태(ex) 결제정보)
//            - 정산 관련 정보(정산 예정 금액, 정산 완료 여부, 환불 처리 여부)
//- 계좌/송금 정보
//- 참여자 승인/거절
//- 공구 수정(마감 연장/마감/공구취소처리 등)
//- 배송정보
//- 매너 점수 요약(후기, 매너점수 표기)
//- 위치 기반 정보
}
