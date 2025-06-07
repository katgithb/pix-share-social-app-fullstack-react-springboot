package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.RequestValidationException;

import java.util.Arrays;

/**
 * Enum representing the possible statuses of a reactivation request.
 */
public enum ReactivationRequestStatus {
    /**
     * Reactivation request is pending review.
     */
    PENDING,

    /**
     * Reactivation request has been approved.
     */
    APPROVED,

    /**
     * Reactivation request has been rejected.
     */
    REJECTED;

    public static ReactivationRequestStatus from(String value) {

        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new RequestValidationException("Invalid reactivation request status: [%s]".formatted(value)));
    }

    public String toLowercaseString() {
        return this.name().toLowerCase();
    }

    public String toSentenceCaseString() {
        // Get the enum name
        String name = this.name();

        // Replace underscores with spaces if present and convert to lowercase
        String lowerCaseName = name.replace("_", " ").toLowerCase();

        // Capitalize the first letter of the entire string
        if (lowerCaseName.isEmpty()) {
            return "";
        }
        return Character.toUpperCase(lowerCaseName.charAt(0)) + lowerCaseName.substring(1);
    }

}