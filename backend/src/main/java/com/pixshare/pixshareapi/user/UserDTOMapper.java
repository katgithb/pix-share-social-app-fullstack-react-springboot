package com.pixshare.pixshareapi.user;

import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UserDTOMapper implements Function<User, UserDTO> {
    @Override
    public UserDTO apply(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getMobile(),
                user.getWebsite(),
                user.getBio(),
                user.getGender(),
                user.getUserImage(),
                user.getFollower(),
                user.getFollowing(),
                user.getStories(),
                user.getSavedPosts(),
                user.getPosts(),
                user.getComments()
        );
    }
}
