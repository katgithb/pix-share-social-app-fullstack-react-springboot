package com.pixshare.pixshareapi.admin;

import java.time.LocalDate;

public interface AdminAnalyticsService {

    GeneralStatsDTO getGeneralStats();

    PostCreationAnalyticsDTO getPostCreationAnalytics(
            Integer year,
            Integer half,
            Integer quarter,
            Integer month,
            PeriodType period,
            String granularity);

    PostCreationAnalyticsDTO getPostCreationAnalyticsForRange(
            LocalDate startDate,
            LocalDate endDate,
            String granularity);
}