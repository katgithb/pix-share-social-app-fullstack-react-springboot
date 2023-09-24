package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserDTOMapper implements Function<User, UserDTO> {

    private final UserViewMapper userViewMapper;
    private final PostDTOMapper postDTOMapper;

    public UserDTOMapper(UserViewMapper userViewMapper, PostDTOMapper postDTOMapper) {
        this.userViewMapper = userViewMapper;
        this.postDTOMapper = postDTOMapper;
    }

    @Override
    public UserDTO apply(User user) {
        return new UserDTO(
                user.getId(),
                user.getUserHandleName(),
                user.getEmail(),
                user.getName(),
                user.getMobile(),
                user.getWebsite(),
                user.getBio(),
                user.getGender(),
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
                new ArrayList<>(),
                user.getSavedPosts().stream()
                        .map(postDTOMapper)
                        .collect(Collectors.toCollection(
                                LinkedHashSet::new)),
                user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList())
        );
    }

}
