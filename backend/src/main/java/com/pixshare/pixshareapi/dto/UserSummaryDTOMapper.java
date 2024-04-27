package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserSummaryDTOMapper implements Function<User, UserSummaryDTO> {

    private final UserViewMapper userViewMapper;

    public UserSummaryDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public UserSummaryDTO apply(User user) {
        return new UserSummaryDTO(
                user.getId(),
                user.getUserHandleName(),
                user.getName(),
                user.getWebsite(),
                user.getBio(),
                user.getUserImageUploadId(),
                user.getUserImage(),
                user.getFollower().stream()
                        .map(userViewMapper)
                        .collect(Collectors.toCollection(
                                LinkedHashSet::new)),
                user.getFollowing().stream()
                        .map(userViewMapper)
                        .collect(Collectors.toCollection(
                                LinkedHashSet::new)),
                false,
                new ArrayList<>(),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );
    }

}
