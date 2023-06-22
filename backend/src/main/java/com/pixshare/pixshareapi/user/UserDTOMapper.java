package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.post.PostDTOMapper;
import org.springframework.stereotype.Service;

import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserDTOMapper implements Function<User, UserDTO> {

    private final PostDTOMapper postDTOMapper;

    public UserDTOMapper(PostDTOMapper postDTOMapper) {
        this.postDTOMapper = postDTOMapper;
    }

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
                user.getSavedPosts().stream()
                        .map(postDTOMapper)
                        .collect(Collectors.toSet())
        );
    }

}
