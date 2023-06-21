package com.pixshare.pixshareapi.exception;

import java.time.LocalDateTime;

public record ApiError(
        String path,
        String message,
        int statusCode,
        LocalDateTime dateTime
) {
}
