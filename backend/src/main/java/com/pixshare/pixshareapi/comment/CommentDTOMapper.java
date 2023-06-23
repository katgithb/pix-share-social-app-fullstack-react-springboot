package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.user.UserViewMapper;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class CommentDTOMapper implements Function<Comment, CommentDTO> {

    private final UserViewMapper userViewMapper;

    public CommentDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public CommentDTO apply(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                userViewMapper.apply(comment.getUser()),
                comment.getLikedByUsers()
        );
    }

}
