package com.pixshare.pixshareapi.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

/**
 * DTO for admin post management, summarizing basic information about posts.
 */
@Data
@Builder
public class AdminPostSummaryDTO {
    private Long id;
    private String caption;
    private String imageUploadId;
    private String image;
    private String location;
    private ZonedDateTime createdAt;
    private UserView user;
}