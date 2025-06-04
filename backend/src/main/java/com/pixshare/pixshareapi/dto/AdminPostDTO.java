package com.pixshare.pixshareapi.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

/**
 * DTO for admin post management, including detailed post information.
 */
@Data
@Builder
public class AdminPostDTO {
    private Long id;
    private String caption;
    private String imageUploadId;
    private String image;
    private String location;
    private ZonedDateTime createdAt;
    private UserView user;

    // Post stats
    private Integer likeCount;
    private Integer saveCount;
    private Integer commentCount;
}