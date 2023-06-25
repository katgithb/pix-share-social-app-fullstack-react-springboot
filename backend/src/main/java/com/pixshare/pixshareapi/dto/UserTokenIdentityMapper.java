package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserTokenIdentityMapper implements Function<User, UserTokenIdentity> {
    @Override
    public UserTokenIdentity apply(User user) {
        return new UserTokenIdentity(
                user.getId(),
                user.getEmail(),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );
    }

}
