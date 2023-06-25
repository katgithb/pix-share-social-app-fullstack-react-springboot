package com.pixshare.pixshareapi.auth;

import com.pixshare.pixshareapi.dto.UserDTO;

public record AuthenticationResponse(
        String token,
        UserDTO user
) {
}
