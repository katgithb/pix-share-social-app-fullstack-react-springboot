package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.post.Post;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class AdminPostSummaryDTOMapper implements Function<Post, AdminPostSummaryDTO> {

    private static final int POST_CAPTION_TRUNCATE_THRESHOLD = 50;

    private final UserViewMapper userViewMapper;

    public AdminPostSummaryDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public AdminPostSummaryDTO apply(Post post) {
        return AdminPostSummaryDTO.builder()
                .id(post.getId())
                .caption(post.getCaption() != null && post.getCaption().length() > POST_CAPTION_TRUNCATE_THRESHOLD
                        ? post.getCaption().substring(0, (POST_CAPTION_TRUNCATE_THRESHOLD - 3)) + "..."
                        : post.getCaption())
                .imageUploadId(post.getImageUploadId())
                .image(post.getImage())
                .location(post.getLocation())
                .createdAt(post.getCreatedAt())
                .user(userViewMapper.apply(post.getUser()))
                .build();
    }

}