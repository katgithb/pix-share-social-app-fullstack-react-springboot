package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface CommentService {

    void createComment(Comment comment, Long postId, Long userId) throws ResourceNotFoundException;

    CommentDTO findCommentById(Long commentId) throws ResourceNotFoundException;

    List<CommentDTO> findCommentsByPostId(Long postId) throws ResourceNotFoundException;

    CommentDTO likeComment(Long commentId, Long userId) throws ResourceNotFoundException;

    CommentDTO unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException;

}
