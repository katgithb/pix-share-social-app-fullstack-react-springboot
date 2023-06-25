package com.pixshare.pixshareapi.auth;

import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.TokenValidationException;

public interface AuthenticationService {

    AuthenticationResponse loginUser(AuthenticationRequest request);

    UserTokenIdentity getUserIdentityFromToken(String authHeader) throws TokenValidationException, ResourceNotFoundException;

}
