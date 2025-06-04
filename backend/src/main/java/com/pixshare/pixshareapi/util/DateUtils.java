package com.pixshare.pixshareapi.util;

import com.pixshare.pixshareapi.admin.GranularityType;
import com.pixshare.pixshareapi.admin.PeriodType;
import com.pixshare.pixshareapi.exception.RequestValidationException;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Utility class for date-related operations.
 * Contains methods for calculating date ranges, formatting dates, and generating date streams.
 */
public final class DateUtils {

    private DateUtils() {
        // Private constructor to prevent instantiation
    }

    /**
     * Calculate date range based on year and period parameters
     *
     * @param year    The year for the date range
     * @param half    Optional half (1-2)
     * @param quarter Optional quarter (1-4)
     * @param month   Optional month (1-12)
     * @param period  Optional period type
     * @return DateRange object containing start and end dates
     */
    public static DateRange calculateDateRange(int year, Integer half, Integer quarter, Integer month, PeriodType period) {
        if (month != null) {
            return getMonthDateRange(year, month);
        }

        if (quarter != null) {
            return getQuarterDateRange(year, quarter);
        }

        if (period != null) {
            return getPeriodDateRange(period);
        }

        if (half != null) {
            return getHalfYearDateRange(year, half);
        }

        // Default to full year
        return getYearDateRange(year);
    }

    /**
     * Get date range for a specific month in a year
     */
    public static DateRange getMonthDateRange(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.with(TemporalAdjusters.lastDayOfMonth());
        return new DateRange(startDate, endDate);
    }

    /**
     * Get date range for a specific quarter in a year
     */
    public static DateRange getQuarterDateRange(int year, int quarter) {
        int startMonth = (quarter - 1) * 3 + 1;
        LocalDate startDate = LocalDate.of(year, startMonth, 1);
        LocalDate endDate = startDate.plusMonths(3).minusDays(1);
        return new DateRange(startDate, endDate);
    }

    /**
     * Get date range for a specific half of a year
     */
    public static DateRange getHalfYearDateRange(int year, int half) {
        int startMonth = (half == 1) ? 1 : 7;
        LocalDate startDate = LocalDate.of(year, startMonth, 1);
        LocalDate endDate = startDate.plusMonths(6).minusDays(1);
        return new DateRange(startDate, endDate);
    }

    /**
     * Get date range for a full year
     */
    public static DateRange getYearDateRange(int year) {
        return new DateRange(
                LocalDate.of(year, 1, 1),
                LocalDate.of(year, 12, 31)
        );
    }

    /**
     * Get date range for past N days (including today)
     */
    public static DateRange getPastNDaysDateRange(int days) {
        LocalDate currentDate = LocalDate.now();
        LocalDate startDate = currentDate.minusDays(days - 1);
        return new DateRange(startDate, currentDate);
    }

    /**
     * Get date range for a specific period type
     */
    public static DateRange getPeriodDateRange(PeriodType periodType) {
        LocalDate today = LocalDate.now();

        switch (periodType) {
            case THIS_WEEK:
                LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
                return new DateRange(startOfWeek, endOfWeek);
            case PAST_7_DAYS:
                return getPastNDaysDateRange(7);
            case PAST_14_DAYS:
                return getPastNDaysDateRange(14);
            case THIS_MONTH:
                return getMonthDateRange(today.getYear(), today.getMonthValue());
            case LAST_MONTH:
                LocalDate lastMonth = today.minusMonths(1);
                return getMonthDateRange(lastMonth.getYear(), lastMonth.getMonthValue());
            default:
                throw new RequestValidationException("Invalid period type. " + "Valid values are: " +
                        Arrays.toString(PeriodType.values()) + " (case-insensitive).");
        }
    }

    /**
     * Format a date as "MMM d, yyyy" (e.g., "Jan 1, 2023")
     */
    public static String formatDayLabel(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.getDefault()));
    }

    /**
     * Format a month as its full name (e.g., "January")
     */
    public static String formatMonthLabel(int month) {
        return Month.of(month).getDisplayName(TextStyle.FULL, Locale.getDefault());
    }

    /**
     * Format a month and year (e.g., "January 2023")
     */
    public static String formatMonthYearLabel(int month, int year) {
        return Month.of(month).getDisplayName(TextStyle.FULL, Locale.getDefault()) + " " + year;
    }

    /**
     * Generate a stream of all dates in a range (inclusive)
     */
    public static Stream<LocalDate> dateStream(LocalDate startDate, LocalDate endDate) {
        return Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(startDate.until(endDate, ChronoUnit.DAYS) + 1);
    }

    /**
     * Generate a stream of all months in a range (inclusive)
     */
    public static Stream<YearMonth> monthStream(LocalDate startDate, LocalDate endDate) {
        YearMonth start = YearMonth.from(startDate);
        YearMonth end = YearMonth.from(endDate);

        return Stream.iterate(start, ym -> ym.plusMonths(1))
                .limit(start.until(end, ChronoUnit.MONTHS) + 1);
    }

    /**
     * Get the current year or use the provided year
     */
    public static int getEffectiveYear(Integer year) {
        return Optional.ofNullable(year).orElse(Year.now().getValue());
    }

    /**
     * Determines the appropriate granularity based on the date range duration.
     */
    public static GranularityType getEffectiveGranularity(DateRange dateRange, String granularity) {
        // Determine granularity based on the date range
        if (dateRange.spansQuarterOrMore()) {
            return GranularityType.MONTHLY;
        } else {
            return Optional.ofNullable(granularity)
                    .map(GranularityType::from)
                    .orElse(GranularityType.DAILY);
        }
    }

    /**
     * Validate date range parameters
     */
    public static void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new RequestValidationException("Start date and end date are required");
        }

        if (startDate.isAfter(endDate)) {
            throw new RequestValidationException("Start date must be before or equal to end date");
        }

        // Limit the date range to prevent performance issues
        if (startDate.plusYears(2).isBefore(endDate) || endDate.getYear() > Year.now().getValue()) {
            throw new RequestValidationException("Date range must be within the last 2 years");
        }
    }

}