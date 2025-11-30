package com.example.saja_saja.service.admin;

import com.example.saja_saja.dto.post.AdminPostListResponseDto;
import com.example.saja_saja.entity.member.Member;
import com.example.saja_saja.entity.member.Role;
import com.example.saja_saja.entity.post.Post;
import com.example.saja_saja.entity.post.PostRepository;
import com.example.saja_saja.exception.BadRequestException;
import com.example.saja_saja.exception.ResourceNotFoundException;
import com.example.saja_saja.service.BuyerService;
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

@Service
@RequiredArgsConstructor
public class AdminPostService {
    private final PostRepository postRepository;
    private final BuyerService buyerService;

    public ResponseEntity getAdminPostList(Member member, Integer process, String title, Pageable pageable) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        try {
            Page<Post> postPage;
            boolean hasTitle = (title != null && !title.isBlank());

            switch (process) {
                case -1:  // 전체
                    if (hasTitle)
                        postPage = postRepository.findAllByTitleContaining(title, pageable);
                    else
                        postPage = postRepository.findAll(pageable);
                    break;

                case 0:   // 접수완료
                    if (hasTitle)
                        postPage = postRepository.findAllByStatusAndTitleContaining(0, title, pageable);
                    else
                        postPage = postRepository.findAllByStatus(0, pageable);
                    break;

                case 1:   // 진행중, 마감임박, 마감
                    List<Integer> statuses = List.of(1, 2, 3);
                    if (hasTitle)
                        postPage = postRepository.findAllByStatusInAndTitleContaining(statuses, title, pageable);
                    else
                        postPage = postRepository.findAllByStatusIn(statuses, pageable);
                    break;

                case 4:   // 승인반려
                    if (hasTitle)
                        postPage = postRepository.findAllByStatusAndTitleContaining(4, title, pageable);
                    else
                        postPage = postRepository.findAllByStatus(4, pageable);
                    break;

                default:
                    throw new BadRequestException("조회 불가능한 process값입니다.", null);
            }

            Page<AdminPostListResponseDto> dtoPage =
                    postPage.map(AdminPostListResponseDto::of);

            HashMap<String, Object> data = new HashMap<>();
            data.put("posts", dtoPage.getContent());
            data.put("hasMore", dtoPage.hasNext());

            return new ResponseEntity(data, HttpStatus.OK);

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("공동 구매 게시글을 불러올 수 없습니다.");
        }
    }

    @Transactional
    public ResponseEntity processPost(Member member, Long postId, Integer process) {
        if (member.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("관리자 권한이 없습니다.");
        }

        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("공동 구매 게시글을 찾을 수 없습니다."));

            if (post.getStatus() != 0) {
                throw new BadRequestException("대기 중인 공동 구매 게시글만 처리 가능합니다.", null);
            }

            switch (process) {
                case 1:
                    post.setStatus(process);
                    break;
                case 4:
                    buyerService.cancel(post.getHost(), postId, 1);

                    post.setStatus(process);
                    post.setIsCanceled(true);
                    break;
                default:
                    throw new BadRequestException("처리 불가능한 process값입니다.", null);
            }

            HashMap<String, Object> data = new HashMap<>();
            data.put("postId", postId);
            data.put("postStatus", post.getStatus());
            return new ResponseEntity(data, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("게시글 처리에 실패하였습니다.");
        }
    }
}
