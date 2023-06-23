package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface CommentService {

    void createComment(Comment comment, Long postId, Long userId) throws ResourceNotFoundException;

    Comment findCommentById(Long commentId) throws ResourceNotFoundException;

    List<Comment> findCommentsByPostId(Long postId) throws ResourceNotFoundException;

    Comment likeComment(Long commentId, Long userId) throws ResourceNotFoundException;

    Comment unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException;

}
