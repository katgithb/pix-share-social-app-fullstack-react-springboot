package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.ReactivationRequest;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.function.Function;

@Component
public class ReactivationRequestDTOMapper implements Function<ReactivationRequest, ReactivationRequestDTO> {

    private final AdminUserSummaryDTOMapper adminUserSummaryDTOMapper;

    public ReactivationRequestDTOMapper(AdminUserSummaryDTOMapper adminUserSummaryDTOMapper) {
        this.adminUserSummaryDTOMapper = adminUserSummaryDTOMapper;
    }

    @Override
    public ReactivationRequestDTO apply(ReactivationRequest reactivationRequest) {
        return ReactivationRequestDTO.builder()
                .id(reactivationRequest.getId())
                .email(reactivationRequest.getEmail())
                .status(reactivationRequest.getStatus())
                .requestedAt(reactivationRequest.getRequestedAt())
                .reviewedAt(reactivationRequest.getReviewedAt())
                .user(Optional.ofNullable(reactivationRequest.getUser())
                        .map(adminUserSummaryDTOMapper)
                        .orElse(null))
                .build();
    }

}