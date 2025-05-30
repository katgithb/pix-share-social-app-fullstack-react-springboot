package com.pixshare.pixshareapi.admin;

import com.fasterxml.jackson.annotation.JsonValue;
import com.pixshare.pixshareapi.exception.RequestValidationException;

import java.util.Arrays;

/**
 * Enum representing the granularity of time periods for analytics data.
 */
public enum GranularityType {
    DAILY,
    MONTHLY;

    public static GranularityType from(String value) {

        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new RequestValidationException("Invalid granularity type. " + "Valid values are: " +
                        Arrays.toString(values()) + " (case-insensitive)."));
    }

    @JsonValue
    public String toLowercaseString() {
        return this.name().toLowerCase();
    }

}