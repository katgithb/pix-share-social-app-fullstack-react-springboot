package com.pixshare.pixshareapi.user;

public record UserUpdateRequest(
        String username,
        String email,
        String name,
        String mobile,
        String website,
        String bio,
        Gender gender
) {
}
