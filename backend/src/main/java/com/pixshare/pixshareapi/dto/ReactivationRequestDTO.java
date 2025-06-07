package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.ReactivationRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

/**
 * DTO for ReactivationRequest entity.
 */
@Data
@Builder
public class ReactivationRequestDTO {
    private Long id;
    private String email;
    private ReactivationRequestStatus status;
    private OffsetDateTime requestedAt;
    private OffsetDateTime reviewedAt;
    private AdminUserSummaryDTO user;
}