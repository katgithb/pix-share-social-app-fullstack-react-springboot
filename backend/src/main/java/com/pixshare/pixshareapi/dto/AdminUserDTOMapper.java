package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AdminUserDTOMapper implements Function<User, AdminUserDTO> {

    @Override
    public AdminUserDTO apply(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .username(user.getUserHandleName())
                .email(user.getEmail())
                .name(user.getName())
                .mobile(user.getMobile())
                .website(user.getWebsite())
                .bio(user.getBio())
                .gender(user.getGender())
                .userImageUploadId(user.getUserImageUploadId())
                .userImage(user.getUserImage())
                .followerCount(user.getFollower().size())
                .followingCount(user.getFollowing().size())
                .roles(user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

}