package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.RequestValidationException;

import java.util.Arrays;

/**
 * Enum representing the possible statuses of a user account.
 */
public enum UserStatus {
    /**
     * User account is active and can be used normally.
     */
    ACTIVE,

    /**
     * User account is inactive and cannot be used until reactivated.
     */
    INACTIVE,

    /**
     * User account has expired.
     */
    EXPIRED,

    /**
     * User account is blocked due to suspicious activity or other reasons.
     */
    BLOCKED;

    public static UserStatus from(String value) {
        if (value == null || value.isBlank()) {
            throw new RequestValidationException("User status is required");
        }

        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new RequestValidationException("Invalid user status: [%s]".formatted(value)));
    }

}