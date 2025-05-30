package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.user.RoleName;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.util.AnalyticsUtils;
import com.pixshare.pixshareapi.util.DateRange;
import com.pixshare.pixshareapi.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    @Override
    public GeneralStatsDTO getGeneralStats() {
        Long totalUsers = userRepository.countByRole_RoleName(RoleName.USER.name());
        long totalPosts = postRepository.count();

        DateRange dateRange = DateUtils.getPeriodDateRange(PeriodType.THIS_WEEK);
        Long newPostsThisWeek = postRepository.countPostsCreatedBetween(
                dateRange.getZonedStartDate(),
                dateRange.getZonedEndDate());

        return GeneralStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalPosts(totalPosts)
                .newPostsThisWeek(newPostsThisWeek)
                .build();
    }

    @Override
    public PostCreationAnalyticsDTO getPostCreationAnalytics(
            Integer year,
            Integer half,
            Integer quarter,
            Integer month,
            PeriodType period,
            String granularity) {

        validateDateRangeParameters(year, half, quarter, month, period);

        int targetYear = period != null
                ? Year.now().getValue()
                : DateUtils.getEffectiveYear(year);

        // Calculate date range based on parameters
        DateRange dateRange = DateUtils.calculateDateRange(targetYear, half, quarter, month, period);
        GranularityType effectiveGranularity = DateUtils.getEffectiveGranularity(dateRange, granularity);

        System.out.printf("Using granularity %s for date range %s (days: %d)%n",
                effectiveGranularity, dateRange, dateRange.getDays());

        return getAnalyticsForDateRange(dateRange, effectiveGranularity, targetYear);
    }

    @Override
    public PostCreationAnalyticsDTO getPostCreationAnalyticsForRange(
            LocalDate startDate,
            LocalDate endDate,
            String granularity) {

        if (startDate == null && endDate == null) {
            startDate = endDate = LocalDate.now();
        }

        validateDateRange(startDate, endDate);

        DateRange dateRange = new DateRange(startDate, endDate);
        GranularityType effectiveGranularity = DateUtils.getEffectiveGranularity(dateRange, granularity);

        System.out.printf("Using granularity %s for date range %s (days: %d)%n",
                effectiveGranularity, dateRange, dateRange.getDays());

        return getAnalyticsForDateRange(dateRange, effectiveGranularity, null);
    }

    /**
     * Validate time parameters for post creation analytics
     */
    private void validateDateRangeParameters(Integer year, Integer half, Integer quarter, Integer month, PeriodType period) {
        // Validate year
        Optional.ofNullable(year).ifPresent(y -> {
            if (y < 2000 || y > Year.now().getValue()) {
                throw new RequestValidationException("Year must be between 2000 and " + (Year.now().getValue()));
            }
        });

        // Validate half
        Optional.ofNullable(half).ifPresent(h -> {
            if (h < 1 || h > 2) {
                throw new RequestValidationException("Half must be either 1 or 2");
            }
        });

        // Validate quarter
        Optional.ofNullable(quarter).ifPresent(q -> {
            if (q < 1 || q > 4) {
                throw new RequestValidationException("Quarter must be between 1 and 4");
            }
        });

        // Validate month
        Optional.ofNullable(month).ifPresent(m -> {
            if (m < 1 || m > 12) {
                throw new RequestValidationException("Month must be between 1 and 12");
            }
        });

        // Validate that only one time period is specified
        long specifiedPeriods = Stream.of(month, quarter, period, half)
                .filter(Objects::nonNull)
                .count();

        if (specifiedPeriods > 1) {
            throw new RequestValidationException("Only one of period, month, quarter, or half can be specified");
        }
    }

    /**
     * Validate date range for post creation analytics
     */
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
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

    /**
     * Get analytics for a date range with specified granularity
     */
    private PostCreationAnalyticsDTO getAnalyticsForDateRange(
            DateRange dateRange,
            GranularityType granularity,
            Integer year) {

        // Log the granularity decision for debugging
        System.out.printf("Processing analytics with granularity %s for date range %s (days: %d)%n",
                granularity, dateRange, dateRange.getDays());

        List<PostCountEntry> postCounts = (granularity == GranularityType.MONTHLY)
                ? getMonthlyPostCounts(dateRange, year)
                : getDailyPostCounts(dateRange);

        return PostCreationAnalyticsDTO.builder()
                .granularity(granularity)
                .year(year)
                .startDate(dateRange.getStartDate())
                .endDate(dateRange.getEndDate())
                .postCounts(postCounts)
                .build();
    }

    private List<PostCountEntry> getMonthlyPostCounts(DateRange dateRange, Integer year) {
        Map<String, PostCountEntry> entriesMap;
        List<Object[]> results;

        if (year != null) {
            // Get monthly counts for a specific year
            results = postRepository.getPostCountsByMonth(year,
                    dateRange.getZonedStartDate(),
                    dateRange.getZonedEndDate());

            entriesMap = AnalyticsUtils.processMonthlyResults(results, year);
        } else {
            // Get monthly counts for a custom date range
            results = postRepository.getPostCountsByMonthInRange(
                    dateRange.getZonedStartDate(),
                    dateRange.getZonedEndDate());

            entriesMap = AnalyticsUtils.processMonthlyRangeResults(results);
        }

        // Fill in missing months in the range
        AnalyticsUtils.fillMissingMonthsInRange(entriesMap, dateRange);

        // Convert map to list and sort
        return AnalyticsUtils.sortPostCountEntries(
                new ArrayList<>(entriesMap.values()),
                GranularityType.MONTHLY);
    }

    private List<PostCountEntry> getDailyPostCounts(DateRange dateRange) {
        // Get daily counts
        List<Object[]> results = postRepository.getPostCountsByDay(
                dateRange.getZonedStartDate(),
                dateRange.getZonedEndDate());

        // Process results into a map
        Map<LocalDate, PostCountEntry> entriesMap = AnalyticsUtils.processDailyResults(results);

        // Fill in missing days
        AnalyticsUtils.fillMissingDays(entriesMap, dateRange);

        // Convert map to list and sort
        return AnalyticsUtils.sortPostCountEntries(
                new ArrayList<>(entriesMap.values()),
                GranularityType.DAILY);
    }

}