package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.dto.PostDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {

    void createPost(PostRequest postRequest, Long userId) throws ResourceNotFoundException;

    void updatePostImage(Long postId, Long userId, MultipartFile imageFile) throws ResourceNotFoundException, UnauthorizedActionException;

    void deletePost(Long postId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException;

    PostDTO findPostById(Long postId, Long userId) throws ResourceNotFoundException;

    PagedResponse<PostDTO> findPostsByUserId(Long authUserId, Long userId, PageRequestDTO pageRequest);

    PagedResponse<PostDTO> findAllPostsByUserIds(Long authUserId, List<Long> userIds, PageRequestDTO pageRequest);

    PagedResponse<PostDTO> findAllPosts(Long authUserId, PageRequestDTO pageRequest);

    PagedResponse<PostDTO> findAllPostsPublic(PageRequestDTO pageRequest);

    PagedResponse<PostDTO> findSavedPostsByUserId(Long userId, PageRequestDTO pageRequest);

    void savePost(Long postId, Long userId) throws ResourceNotFoundException;

    void unsavePost(Long postId, Long userId) throws ResourceNotFoundException;

    PostDTO likePost(Long postId, Long userId) throws ResourceNotFoundException;

    PostDTO unlikePost(Long postId, Long userId) throws ResourceNotFoundException;

    Boolean isPostLikedByUser(Long postId, Long userId) throws ResourceNotFoundException;

    Boolean isPostSavedByUser(Long postId, Long userId) throws ResourceNotFoundException;
}
