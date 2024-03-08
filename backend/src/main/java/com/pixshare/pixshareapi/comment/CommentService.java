package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;

import java.util.List;

public interface CommentService {

    void createComment(CommentRequest commentRequest, Long postId, Long userId) throws ResourceNotFoundException;

    void deleteCommentsByPostId(Long postId);

    void deleteComment(Long commentId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException;

    CommentDTO findCommentById(Long commentId, Long userId) throws ResourceNotFoundException;

    List<CommentDTO> findCommentsByPostId(Long postId, Long userId) throws ResourceNotFoundException;

    CommentDTO likeComment(Long commentId, Long userId) throws ResourceNotFoundException;

    CommentDTO unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException;

}
