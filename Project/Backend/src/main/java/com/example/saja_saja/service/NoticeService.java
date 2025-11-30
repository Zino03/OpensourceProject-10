package com.example.saja_saja.service;

import com.example.saja_saja.dto.post.NoticeRequestDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.post.*;
import com.example.saja_saja.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;
    private final PostRepository postRepository;
    public ResponseEntity save(Member member, Long postId, NoticeRequestDto noticeRequestDto) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("주최자만 공지를 등록할 수 있습니다.", null);
        }

        Notice notice = Notice.builder()
                .post(post)
                .content(noticeRequestDto.getContent())
                .createdAt(LocalDateTime.now())
                .isBanned(Boolean.FALSE)
                .build();

        noticeRepository.save(notice);

        return new ResponseEntity(notice, HttpStatus.OK);
    }

    public ResponseEntity delete(Member member, Long postId, Long noticeId) {
        Optional<Post> optionalP = postRepository.findById(postId);

        if (optionalP.isEmpty()) {
            throw new BadRequestException("공동구매 게시글을 찾을 수 없습니다.", null);
        }

        if (member.getUser().getIsBanned().equals(Boolean.TRUE)) {
            throw new BadRequestException("이용이 정지된 사용자입니다.", null);
        }

        Post post = optionalP.get();

        Optional<Notice> optionalN = noticeRepository.findByIdAndPost(noticeId, post);

        if (optionalN.isEmpty()) {
            throw new BadRequestException("공지를 찾을 수 없습니다.", null);
        }

        Notice notice = optionalN.get();

        if (Boolean.TRUE.equals(post.getIsCanceled())) {
            throw new BadRequestException("취소된 공동구매 게시글입니다.", null);
        }

        if (!member.getUser().equals(post.getHost())) {
            throw new BadRequestException("주최자만 공지를 삭제할 수 있습니다.", null);
        }

        postRepository.delete(post);

        return new ResponseEntity("공지가 삭제되었습니다.", HttpStatus.OK);
    }
}
