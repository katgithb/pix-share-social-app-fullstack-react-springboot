package com.pixshare.pixshareapi.exception;

public class CloudinaryResourceException extends RuntimeException {
    public CloudinaryResourceException(String message) {
        super(message);
    }

    public CloudinaryResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
