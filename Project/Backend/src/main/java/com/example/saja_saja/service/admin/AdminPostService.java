package com.example.saja_saja.service.admin;

import com.example.saja_saja.dto.post.AdminPostListResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.post.PostRepository;
import com.example.saja_saja.exception.BadRequestException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AdminPostService {
    private final PostRepository postRepository;

    public ResponseEntity adminPostList(Member member, Integer process, Pageable pageable) {
        try {
            if (member.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("게시글 관리 권한이 없습니다.");
            }

            Page<Post> postPage;

            switch (process) {
                case -1:
                    postPage = postRepository.findAll(pageable);
                    break;
                case 0:
                    postPage = postRepository.findAllByStatus(process, pageable);
                    break;
                case 1:
                    List<Integer> statuses = new ArrayList<>();
                    statuses.add(1);
                    statuses.add(2);
                    statuses.add(3);
                    postPage = postRepository.findAllByStatusIn(statuses, pageable);
                    break;
                case 4:
                    postPage = postRepository.findAllByStatus(4, pageable);
                    break;
                default:
                    throw new BadRequestException("조회 불가능한 process값입니다.", null);
            }

            Page<AdminPostListResponseDto> dtoPage = postPage.map(
                    post -> AdminPostListResponseDto.of(post)
            );

            List<AdminPostListResponseDto> postList = dtoPage.getContent();
            boolean hasMore = dtoPage.hasNext();

            HashMap<String, Object> data = new HashMap<>();
            data.put("posts", postList);
            data.put("hasMore", hasMore);
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            e.printStackTrace();
            throw e;
        } catch (BadRequestException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("공동 구매 게시글을 찾을 수 없습니다.", e);
        }
    }

    @Transactional
    public ResponseEntity process(Member member, Long postId, Integer process) {
        try {
            if (member.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("게시글 관리 권한이 없습니다.");
            }

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new NoSuchElementException("공동 구매 게시글을 찾을 수 없습니다."));

            if (post.getStatus() != 0) {
                throw new BadRequestException("대기 중인 공동 구매 게시글만 처리 가능합니다.", null);
            }

            if (process == 1 || process == 4) {
                post.setStatus(process);
            } else {
                throw new BadRequestException("처리 불가능한 process값입니다.", null);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("postId", postId);
            data.put("postStatus", post.getStatus());
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (AccessDeniedException e) {
            e.printStackTrace();
            throw e;
        } catch (NoSuchElementException e) {
            throw new BadRequestException(e.getMessage(), e);
        } catch (BadRequestException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("게시글 처리에 실패하였습니다.", e);
        }
    }
}
