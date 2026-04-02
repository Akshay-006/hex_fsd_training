package com.springboot.SimplyFly.config;


import com.springboot.SimplyFly.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<?> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e
    ){
        Map<String,Object> map = new HashMap<>();
        map.put("message",e.getMessage());
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(map);

    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e
    ){
        Map<String,Object> map = new HashMap<>();
        map.put("message", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.EXPECTATION_FAILED)
                .body(map);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(
            ResourceNotFoundException e
    ){

        Map<String,Object> map = new HashMap<>();
        map.put("message",e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);


    }






}
