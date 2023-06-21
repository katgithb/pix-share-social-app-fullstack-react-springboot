package com.pixshare.pixshareapi.user;

public record UserRegistrationRequest(
        String username,
        String email,
        String name,
        String password,
        Gender gender
) {
}
