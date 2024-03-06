package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.post.Post;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PostViewMapper implements Function<Post, PostView> {

    private final UserViewMapper userViewMapper;

    public PostViewMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public PostView apply(Post post) {
        return new PostView(
                post.getId(),
                post.getCaption(),
                post.getImage(),
                post.getLocation(),
                post.getCreatedAt(),
                userViewMapper.apply(post.getUser())
        );
    }

}
