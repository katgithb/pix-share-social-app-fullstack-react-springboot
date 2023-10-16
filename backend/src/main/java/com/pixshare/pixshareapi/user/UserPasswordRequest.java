package com.pixshare.pixshareapi.user;

public record UserPasswordRequest(
        String currPassword,
        String newPassword
) {
}
