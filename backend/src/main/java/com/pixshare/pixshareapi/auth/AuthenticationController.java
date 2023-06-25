package com.pixshare.pixshareapi.auth;

import com.pixshare.pixshareapi.jwt.JWTUtil;
import com.pixshare.pixshareapi.user.UserRegistrationRequest;
import com.pixshare.pixshareapi.user.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationServiceImpl authenticationService;

    private final UserService userService;

    private final JWTUtil jwtUtil;

    public AuthenticationController(AuthenticationServiceImpl authenticationService, UserService userService, JWTUtil jwtUtil) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody UserRegistrationRequest request) {
        userService.registerUser(request);
        String token = jwtUtil.issueToken(request.email(), "ROLE_USER");

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, token)
                .build();
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse response = authenticationService.loginUser(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, response.token())
                .body(response);

    }
}
