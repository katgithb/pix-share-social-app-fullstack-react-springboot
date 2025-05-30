package com.pixshare.pixshareapi.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
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
                "RESOURCE_NOT_FOUND",
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
                "INVALID_REQUEST",
                status.value(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolationException(ConstraintViolationException e,
                                                                       HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "INVALID_REQUEST_PAYLOAD",
                status.value(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiError> handleInsufficientAuthenticationException(InsufficientAuthenticationException e,
                                                                              HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "INSUFFICIENT_AUTHENTICATION",
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentialsException(BadCredentialsException e,
                                                                  HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ApiError apiError = new ApiError(request.getRequestURI(),
                "Invalid credentials. Please try again.",
                "INVALID_CREDENTIALS",
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(CloudinaryResourceException.class)
    public ResponseEntity<ApiError> handleCloudinaryResourceException(CloudinaryResourceException e,
                                                                      HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicateResourceException(DuplicateResourceException e,
                                                                     HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "DUPLICATE_RESOURCE",
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(TokenValidationException.class)
    public ResponseEntity<ApiError> handleTokenValidationException(TokenValidationException e,
                                                                   HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "INVALID_TOKEN",
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ApiError> handleUnauthorizedActionException(UnauthorizedActionException e,
                                                                      HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "UNAUTHORIZED_ACTION",
                status.value(),
                LocalDateTime.now());

        return new ResponseEntity<>(apiError, status);
    }

    @ExceptionHandler(EmailDeliveryException.class)
    public ResponseEntity<ApiError> handleEmailDeliveryException(EmailDeliveryException e,
                                                                 HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "EMAIL_DELIVERY_ERROR",
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
