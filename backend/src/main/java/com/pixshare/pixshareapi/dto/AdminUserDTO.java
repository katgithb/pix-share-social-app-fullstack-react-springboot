package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.Gender;
import com.pixshare.pixshareapi.user.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * DTO for admin user management, including audit fields and status information.
 */
@Data
@Builder
public class AdminUserDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String mobile;
    private String website;
    private String bio;
    private Gender gender;
    private String userImageUploadId;
    private String userImage;
    private Integer followerCount;
    private Integer followingCount;
    private List<String> roles;

    // Admin-specific audit fields
    private UserStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime lastLoginAt;
}