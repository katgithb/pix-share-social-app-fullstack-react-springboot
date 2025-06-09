package com.pixshare.pixshareapi.admin;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Optional;

/**
 * REST controller for admin analytics endpoints.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/v1/admin/analytics")
@Tag(name = "Admin Analytics", description = "Endpoints for admin analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    /**
     * Get general statistics for the admin dashboard
     */
    @GetMapping("/overview")
    public ResponseEntity<GeneralStatsDTO> getGeneralStats() {
        System.out.println("Fetching general statistics for admin dashboard");

        return ResponseEntity.ok(adminAnalyticsService.getGeneralStats());
    }

    /**
     * Get post creation analytics for a specific time period
     */
    @GetMapping("/posts/creation")
    public ResponseEntity<PostCreationAnalyticsDTO> getPostCreationAnalytics(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer half,
            @RequestParam(required = false) Integer quarter,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String granularity) {

        PeriodType periodType = Optional.ofNullable(period)
                .map(PeriodType::from)
                .orElse(null);

        System.out.printf("Fetching post creation analytics with parameters: year=%s, half=%s, quarter=%s, month=%s, period=%s, granularity=%s%n",
                year, half, quarter, month, period, granularity);

        return ResponseEntity.ok(adminAnalyticsService.getPostCreationAnalytics(
                year, half, quarter, month, periodType, granularity));
    }

    /**
     * Get post creation analytics for a specific date range
     */
    @GetMapping("/posts/creation/range")
    public ResponseEntity<PostCreationAnalyticsDTO> getPostCreationAnalyticsForRange(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String granularity) {

        System.out.printf("Fetching post creation analytics for date range: startDate=%s, endDate=%s, granularity=%s%n",
                startDate, endDate, granularity);

        return ResponseEntity.ok(adminAnalyticsService.getPostCreationAnalyticsForRange(
                startDate, endDate, granularity));
    }

}