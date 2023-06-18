package com.projectoop.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class QuizAttemptControllerAdvice {
    
    @ExceptionHandler(QuizNotOpenException.class)
    public ResponseEntity<String> handleQuizNotOpenException(QuizNotOpenException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body("New quiz attempt cannot be created.\n"+ex.getMessage());
    }
}

class QuizNotOpenException extends RuntimeException {
    public QuizNotOpenException(String message) {
        super(message);
    }
}

