package com.example.saja_saja.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class BadRequestException extends RuntimeException {
    private final Object body;

    public BadRequestException(String message, Object body) {
        super(message);
        this.body = body;
    }

    public Object getBody() {
        return body;
    }
}