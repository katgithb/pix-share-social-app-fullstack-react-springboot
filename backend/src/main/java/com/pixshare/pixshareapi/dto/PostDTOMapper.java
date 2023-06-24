package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.post.Post;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
                new ArrayList<>(),
                post.getLikedByUsers()
        );
    }

}
