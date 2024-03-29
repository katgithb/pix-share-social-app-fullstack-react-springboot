package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.comment.Comment;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.function.Function;
import java.util.stream.Collectors;

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
                comment.getLikedByUsers().stream()
                        .map(userViewMapper)
                        .collect(Collectors.toCollection(
                                LinkedHashSet::new)),
                false
        );
    }

}
