package com.pixshare.pixshareapi.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GeneralStatsDTO {
    private long totalUsers;
    private long totalPosts;
    private long newPostsThisWeek;
}