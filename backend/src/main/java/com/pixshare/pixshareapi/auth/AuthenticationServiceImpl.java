package com.pixshare.pixshareapi.auth;

import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserDTOMapper;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import com.pixshare.pixshareapi.dto.UserTokenIdentityMapper;
import com.pixshare.pixshareapi.exception.TokenValidationException;
import com.pixshare.pixshareapi.jwt.JWTUtil;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JWTUtil jwtUtil;

    private final UserDTOMapper userDTOMapper;

    private final UserTokenIdentityMapper userTokenIdentityMapper;

    public AuthenticationServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JWTUtil jwtUtil, UserDTOMapper userDTOMapper, UserTokenIdentityMapper userTokenIdentityMapper) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDTOMapper = userDTOMapper;
        this.userTokenIdentityMapper = userTokenIdentityMapper;
    }

    @Override
    public AuthenticationResponse loginUser(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User principal = (User) authentication.getPrincipal();
        UserDTO userDTO = userDTOMapper.apply(principal);
        String token = jwtUtil.issueToken(userDTO.getEmail(), userDTO.getRoles());

        return new AuthenticationResponse(token, userDTO);
    }

    @Override
    public UserTokenIdentity getUserIdentityFromToken(String authHeader) throws TokenValidationException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new TokenValidationException("Invalid token format");
        }

        String token = authHeader.substring(7);
        //Optional<String> subject = Optional.ofNullable(jwtUtil.getSubject(token));

        User user = Optional.ofNullable(jwtUtil.getSubject(token))
                .flatMap(userRepository::findByEmail)
                .orElseThrow(() -> new TokenValidationException("Invalid token"));

        return userTokenIdentityMapper.apply(user);
    }


}
