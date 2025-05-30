package com.pixshare.pixshareapi.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class DelegatedAuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public DelegatedAuthEntryPoint() {
        this.objectMapper = new ObjectMapper();

        // Register module for Java 8 Date/Time API
        this.objectMapper.registerModule(new JavaTimeModule());
        // Prevent writing dates as timestamps
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException e) throws IOException, ServletException {

        HttpStatus status = HttpStatus.UNAUTHORIZED;
        response.setStatus(status.value());
        response.setContentType("application/json");

        ApiError apiError = new ApiError(request.getRequestURI(),
                e.getMessage(),
                "INSUFFICIENT_AUTHENTICATION",
                status.value(),
                LocalDateTime.now());

        String jsonResponse = objectMapper.writeValueAsString(apiError);
        response.getWriter().write(jsonResponse);
    }

}
