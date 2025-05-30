package com.pixshare.pixshareapi.admin;

import com.fasterxml.jackson.annotation.JsonValue;
import com.pixshare.pixshareapi.exception.RequestValidationException;

import java.util.Arrays;

/**
 * Enum representing different period types for filtering data.
 */
public enum PeriodType {
    THIS_WEEK,
    PAST_7_DAYS,
    PAST_14_DAYS,
    THIS_MONTH,
    LAST_MONTH;

    public static PeriodType from(String value) {

        return Arrays.stream(values())
                .filter(type -> type.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new RequestValidationException("Invalid period type. " + "Valid values are: " +
                        Arrays.toString(values()) + " (case-insensitive)."));
    }

    @JsonValue
    public String toLowercaseString() {
        return this.name().toLowerCase();
    }

}
