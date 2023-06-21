package com.pixshare.pixshareapi.user;

public record UserUpdateRequest(
        Long id,
        String username,
        String email,
        String password,
        String name,
        String mobile,
        String website,
        String bio,
        Gender gender,
        String userImage
) {
}
