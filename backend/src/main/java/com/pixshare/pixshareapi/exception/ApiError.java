package com.pixshare.pixshareapi.exception;

import java.time.LocalDateTime;

public record ApiError(
        String path,
        String message,
        String errorCode,
        int statusCode,
        LocalDateTime dateTime
) {
    public ApiError(String path, String message, int statusCode, LocalDateTime dateTime) {
        this(path, message, "INTERNAL_SERVER_ERROR", statusCode, dateTime);
    }
}
