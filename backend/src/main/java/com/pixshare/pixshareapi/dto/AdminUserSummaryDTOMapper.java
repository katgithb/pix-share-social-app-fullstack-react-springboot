package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AdminUserSummaryDTOMapper implements Function<User, AdminUserSummaryDTO> {

    @Override
    public AdminUserSummaryDTO apply(User user) {
        return AdminUserSummaryDTO.builder()
                .id(user.getId())
                .username(user.getUserHandleName())
                .email(user.getEmail())
                .name(user.getName())
                .gender(user.getGender())
                .userImageUploadId(user.getUserImageUploadId())
                .userImage(user.getUserImage())
                .roles(user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

}