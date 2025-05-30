package com.pixshare.pixshareapi.util;

import com.pixshare.pixshareapi.admin.GranularityType;
import com.pixshare.pixshareapi.admin.PostCountEntry;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Utility class for analytics-related operations.
 */
public final class AnalyticsUtils {

    private AnalyticsUtils() {
        // Private constructor to prevent instantiation
    }

    /**
     * Process raw database results into PostCountEntry objects for monthly data
     *
     * @param results Database query results containing [month_number, count]
     * @param year    The year for the data
     * @return Map of month key to PostCountEntry
     */
    public static Map<String, PostCountEntry> processMonthlyResults(List<Object[]> results, int year) {
        Map<String, PostCountEntry> entriesMap = new HashMap<>();

        results.forEach(row -> {
            int month = ((Number) row[0]).intValue();
            long count = ((Number) row[1]).longValue();

            String monthName = DateUtils.formatMonthLabel(month);
            String key = String.format("%d-%02d", year, month);

            entriesMap.put(key, PostCountEntry.builder()
                    .periodLabel(monthName)
                    .count(count)
                    .month(month)
                    .year(year)
                    .build());
        });

        return entriesMap;
    }

    /**
     * Process raw database results into PostCountEntry objects for monthly range data
     *
     * @param results Database query results containing [year_month_string, count]
     * @return Map of month key to PostCountEntry
     */
    public static Map<String, PostCountEntry> processMonthlyRangeResults(List<Object[]> results) {
        Map<String, PostCountEntry> entriesMap = new HashMap<>();

        results.forEach(row -> {
            String yearMonth = (String) row[0]; // Format: YYYY-MM
            long count = ((Number) row[1]).longValue();

            // Parse year and month from the string
            String[] parts = yearMonth.split("-");
            int yearPart = Integer.parseInt(parts[0]);
            int monthPart = Integer.parseInt(parts[1]);

            String monthName = DateUtils.formatMonthLabel(monthPart);

            entriesMap.put(yearMonth, PostCountEntry.builder()
                    .periodLabel(monthName)
                    .count(count)
                    .month(monthPart)
                    .year(yearPart)
                    .build());
        });

        return entriesMap;
    }

    /**
     * Process raw database results into PostCountEntry objects for daily data
     *
     * @param results Database query results containing [date_string, count]
     * @return Map of date to PostCountEntry
     */
    public static Map<LocalDate, PostCountEntry> processDailyResults(List<Object[]> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        row -> LocalDate.parse((String) row[0]),
                        row -> {
                            LocalDate date = LocalDate.parse((String) row[0]);
                            String formattedDate = DateUtils.formatDayLabel(date);
                            return PostCountEntry.builder()
                                    .periodLabel(formattedDate)
                                    .count(((Number) row[1]).longValue())
                                    .date(date)
                                    .build();
                        }
                ));
    }

    /**
     * Fill in missing months in a date range with zero counts
     *
     * @param entriesMap Map of year-month key to PostCountEntry
     * @param dateRange  The date range to fill
     */
    public static void fillMissingMonthsInRange(Map<String, PostCountEntry> entriesMap, DateRange dateRange) {
        DateUtils.monthStream(dateRange.getStartDate(), dateRange.getEndDate())
                .forEach(ym -> {
                    String key = String.format("%d-%02d", ym.getYear(), ym.getMonthValue());
                    entriesMap.computeIfAbsent(key, k -> {
                        String monthName = DateUtils.formatMonthLabel(
                                ym.getMonthValue());
                        return PostCountEntry.builder()
                                .periodLabel(monthName)
                                .count(0)
                                .month(ym.getMonthValue())
                                .year(ym.getYear())
                                .build();
                    });
                });
    }

    /**
     * Fill in missing days in a date range with zero counts
     *
     * @param entriesMap Map of date to PostCountEntry
     * @param dateRange  The date range to fill
     */
    public static void fillMissingDays(Map<LocalDate, PostCountEntry> entriesMap, DateRange dateRange) {
        DateUtils.dateStream(dateRange.getStartDate(), dateRange.getEndDate())
                .forEach(date -> entriesMap.computeIfAbsent(date, d -> {
                    String formattedDate = DateUtils.formatDayLabel(d);
                    return PostCountEntry.builder()
                            .periodLabel(formattedDate)
                            .count(0)
                            .date(d)
                            .build();
                }));
    }

    /**
     * Sort post count entries by date or month
     *
     * @param postCounts  List of post count entries
     * @param granularity The granularity of the data
     * @return Sorted list of post count entries
     */
    public static List<PostCountEntry> sortPostCountEntries(List<PostCountEntry> postCounts,
                                                            GranularityType granularity) {
        Comparator<PostCountEntry> comparator = (granularity == GranularityType.DAILY)
                ? Comparator.comparing(PostCountEntry::getDate)
                : Comparator.comparing(PostCountEntry::getYear)
                .thenComparing(PostCountEntry::getMonth);

        return postCounts.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }
    
}