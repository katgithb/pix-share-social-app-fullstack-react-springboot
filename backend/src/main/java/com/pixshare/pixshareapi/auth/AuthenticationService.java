package com.pixshare.pixshareapi.auth;

import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserDTOMapper;
import com.pixshare.pixshareapi.jwt.JWTUtil;
import com.pixshare.pixshareapi.user.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    private final UserDTOMapper userDTOMapper;

    public AuthenticationService(AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserDTOMapper userDTOMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDTOMapper = userDTOMapper;
    }

    public AuthenticationResponse loginUser(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User principal = (User) authentication.getPrincipal();
        UserDTO userDTO = userDTOMapper.apply(principal);
        String token = jwtUtil.issueToken(userDTO.getUsername(), userDTO.getRoles());

        return new AuthenticationResponse(token, userDTO);
    }
    
}
