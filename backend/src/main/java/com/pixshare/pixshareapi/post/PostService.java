package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.dto.PostDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;

import java.util.List;

public interface PostService {

    void createPost(Post post, Long userId) throws ResourceNotFoundException;

    void deletePost(Long postId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException;

    List<PostDTO> findPostsByUserId(Long userId) throws ResourceNotFoundException;

    PostDTO findPostById(Long postId) throws ResourceNotFoundException;

    List<PostDTO> findAllPostsByUserIds(List<Long> userIds) throws ResourceNotFoundException;

    void savePost(Long postId, Long userId) throws ResourceNotFoundException;

    void unsavePost(Long postId, Long userId) throws ResourceNotFoundException;

    PostDTO likePost(Long postId, Long userId) throws ResourceNotFoundException;

    PostDTO unlikePost(Long postId, Long userId) throws ResourceNotFoundException;

}
