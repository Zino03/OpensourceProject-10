package com.example.saja_saja.controller;

import com.example.saja_saja.config.SecurityUtil;
import com.example.saja_saja.dto.post.PostRequestDto;
import com.example.saja_saja.dto.post.PostWithQuantityRequest;
import com.example.saja_saja.service.PostService;
import com.example.saja_saja.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final UserService userService;

    @PostMapping("/post")
    public ResponseEntity save(@RequestBody PostWithQuantityRequest req, BindingResult errors) {
        return postService.save(userService.getMember(SecurityUtil.getCurrentUserId()), req.getPost(), req.getQuantity(), errors);
    }

    @GetMapping("/post/{id}")
    public ResponseEntity post(@PathVariable long id) {
        return postService.post(userService.getMember(SecurityUtil.getCurrentUserId()), id);
    }
}
