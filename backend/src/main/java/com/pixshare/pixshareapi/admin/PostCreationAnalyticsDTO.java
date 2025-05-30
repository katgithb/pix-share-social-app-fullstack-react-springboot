package com.pixshare.pixshareapi.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class PostCreationAnalyticsDTO {
    private GranularityType granularity;
    private Integer year;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder.Default
    private List<PostCountEntry> postCounts = new ArrayList<>();
}