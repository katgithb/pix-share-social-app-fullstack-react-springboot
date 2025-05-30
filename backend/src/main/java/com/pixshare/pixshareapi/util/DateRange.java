package com.pixshare.pixshareapi.util;

import com.pixshare.pixshareapi.exception.RequestValidationException;
import lombok.Getter;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Represents a date range with start and end dates.
 * Immutable class for thread safety.
 */
@Getter
public class DateRange {
    // Threshold in days to switch from DAILY to MONTHLY granularity (approximately a quarter)
    private static final int QUARTERLY_GRANULARITY_THRESHOLD = 90;
    private final LocalDate startDate;
    private final LocalDate endDate;

    /**
     * Creates a new date range with the specified start and end dates.
     */
    public DateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new RequestValidationException("Start date must be before or equal to end date");
        }

        this.startDate = startDate;
        this.endDate = endDate;
    }

    /**
     * Gets the start date as a ZonedDateTime at the start of the day.
     */
    public ZonedDateTime getZonedStartDate() {
        return startDate.atStartOfDay(ZoneId.systemDefault());
    }

    /**
     * Gets the end date as a ZonedDateTime at the end of the day.
     */
    public ZonedDateTime getZonedEndDate() {
        return endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault());
    }

    /**
     * Checks if a date is within this range (inclusive).
     */
    public boolean contains(LocalDate date) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    /**
     * Returns the number of days in this range (inclusive).
     */
    public long getDays() {
        return startDate.until(endDate, ChronoUnit.DAYS) + 1;
    }

    /**
     * Checks if this date range spans multiple months.
     */
    public boolean spansMultipleMonths() {
        return startDate.getYear() != endDate.getYear() ||
                startDate.getMonth() != endDate.getMonth();
    }

    /**
     * Checks if this date range spans a quarter or more.
     */
    public boolean spansQuarterOrMore() {
        return getDays() >= QUARTERLY_GRANULARITY_THRESHOLD;
    }

    @Override
    public String toString() {
        return String.format("DateRange[%s to %s]", startDate, endDate);
    }
    
}