package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.user.UserViewMapper;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PostDTOMapper implements Function<Post, PostDTO> {

    private final UserViewMapper userViewMapper;

    public PostDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public PostDTO apply(Post post) {
        return new PostDTO(
                post.getId(),
                post.getCaption(),
                post.getImage(),
                post.getLocation(),
                post.getCreatedAt(),
                userViewMapper.apply(post.getUser()),
                post.getComments(),
                post.getLikedByUsers()
        );
    }

}
