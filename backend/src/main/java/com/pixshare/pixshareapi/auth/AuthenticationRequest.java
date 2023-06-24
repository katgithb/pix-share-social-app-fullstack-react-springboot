package com.pixshare.pixshareapi.auth;

public record AuthenticationRequest(
        String username,
        String password
) {
}
