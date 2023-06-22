package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;

import java.util.List;

public interface PostService {

    void createPost(Post post, Long userId) throws ResourceNotFoundException;

    void deletePost(Long postId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException;

    List<Post> findPostsByUserId(Long userId) throws ResourceNotFoundException;

    Post findPostById(Long postId) throws ResourceNotFoundException;

    List<Post> findAllPostsByUserIds(List<Long> userIds) throws ResourceNotFoundException;

    void savePost(Long postId, Long userId) throws ResourceNotFoundException;

    void unsavePost(Long postId, Long userId) throws ResourceNotFoundException;

    Post likePost(Long postId, Long userId) throws ResourceNotFoundException;

    Post unlikePost(Long postId, Long userId) throws ResourceNotFoundException;

}
