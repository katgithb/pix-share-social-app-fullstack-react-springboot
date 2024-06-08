package com.pixshare.pixshareapi.user;

public record UserPasswordResetRequest(
        String email,
        String token,
        String newPassword
) {
}
