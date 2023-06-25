package com.pixshare.pixshareapi.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class DefaultExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(ResourceNotFoundException e,
                                                                    HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiError> handleRequestValidationException(RequestValidationException e,
                                                                     HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiError> handleInsufficientAuthenticationException(InsufficientAuthenticationException e,
                                                                              HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentialsException(BadCredentialsException e,
                                                                  HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception e,
                                                    HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

}
