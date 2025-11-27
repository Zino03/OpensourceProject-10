package com.example.saja_saja.service;

import com.example.saja_saja.entity.post.Review;
import com.example.saja_saja.entity.post.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    public ResponseEntity save() {
        //TODO
        return null;
    }
    public ResponseEntity hide() {
        //TODO
        return null;
    }
    public ResponseEntity delete() {
        //TODO
        return null;
    }
}
