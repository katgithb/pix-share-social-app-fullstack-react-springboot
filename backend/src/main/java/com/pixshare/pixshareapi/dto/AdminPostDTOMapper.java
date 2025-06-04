package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.post.Post;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class AdminPostDTOMapper implements Function<Post, AdminPostDTO> {

    private final UserViewMapper userViewMapper;

    public AdminPostDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public AdminPostDTO apply(Post post) {
        return AdminPostDTO.builder()
                .id(post.getId())
                .caption(post.getCaption())
                .imageUploadId(post.getImageUploadId())
                .image(post.getImage())
                .location(post.getLocation())
                .createdAt(post.getCreatedAt())
                .user(userViewMapper.apply(post.getUser()))
                .likeCount(post.getLikedByUsers().size())
                .saveCount(post.getSavedByUsers().size())
                .commentCount(0)
                .build();
    }

}