package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.comment.CommentRepository;
import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.user.MessageResponse;
import com.pixshare.pixshareapi.user.RoleName;
import com.pixshare.pixshareapi.util.DateRange;
import com.pixshare.pixshareapi.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminPostManagementServiceImpl implements AdminPostManagementService {

    private final PostRepository postRepository;

    private final CommentRepository commentRepository;

    private final UploadService uploadService;

    private final AdminPostSummaryDTOMapper adminPostSummaryDTOMapper;

    private final AdminPostDTOMapper adminPostDTOMapper;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminPostSummaryDTO> getAllPosts(PageRequestDTO pageRequest) {
        Pageable pageable = pageRequest.toPageable();
        Page<Post> postPage = postRepository.findAllByUser_Role_RoleNameNot(
                RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromPostPage(postPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminPostSummaryDTO> getAllPostsByUserId(Long userId, PageRequestDTO pageRequest) {
        Pageable pageable = pageRequest.toPageable();
        Page<Post> postPage = postRepository.findAllByUser_IdAndUser_Role_RoleNameNot(
                userId, RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromPostPage(postPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminPostSummaryDTO> filterPostsByDateRange(
            LocalDate startDate,
            LocalDate endDate,
            PageRequestDTO pageRequest) {

        Pageable pageable = pageRequest.toPageable();
        Page<Post> postPage;

        DateUtils.validateDateRange(startDate, endDate);
        DateRange dateRange = new DateRange(startDate, endDate);

        postPage = postRepository.findAllByCreatedAtBetweenAndUser_Role_RoleNameNot(
                dateRange.getZonedStartDate(),
                dateRange.getZonedEndDate(),
                RoleName.ADMIN.name(),
                pageable);

        return createPagedResponseFromPostPage(postPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminPostSummaryDTO> searchPosts(String query, PageRequestDTO pageRequest) {
        String searchQuery = query.toLowerCase();

        Pageable pageable = pageRequest.toPageable();
        Page<Post> postPage = postRepository.searchByCaptionOrLocationAndUser_Role_RoleNameNot(
                searchQuery, RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromPostPage(postPage);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminPostDTO getPostById(Long postId) throws ResourceNotFoundException {
        String adminRole = RoleName.ADMIN.name();

        return postRepository.findByIdAndUser_Role_RoleNameNot(postId, adminRole)
                .map(adminPostDTOMapper)
                .map(postDTO -> {
                    postDTO.setCommentCount(
                            commentRepository.countByPost_IdAndUser_Role_RoleNameNot(
                                    postDTO.getId(), adminRole).intValue()
                    );

                    return postDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
    }

    @Override
    @Transactional
    public MessageResponse deletePost(Long postId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        // Delete the comments associated with the post
        commentRepository.deleteByPostId(postId);

        // Hard delete the post
        removePostImageResource(post.getImageUploadId());
        postRepository.delete(post);

        return new MessageResponse("Post has been deleted successfully");
    }

    /**
     * Helper method to create a paged response from a page of posts.
     */
    private PagedResponse<AdminPostSummaryDTO> createPagedResponseFromPostPage(Page<Post> postPage) {
        List<AdminPostSummaryDTO> content = postPage.getContent().stream()
                .map(adminPostSummaryDTOMapper)
                .filter(Objects::nonNull)
                .toList();

        return new PagedResponse<>(
                content,
                postPage.getNumber(),
                postPage.getSize(),
                postPage.getTotalElements(),
                postPage.getTotalPages(),
                postPage.isLast());
    }

    /**
     * Helper method to remove the post image resource from Cloudinary when deleting a post.
     */
    private void removePostImageResource(String postImageUploadId) {
        if (postImageUploadId != null && !postImageUploadId.isBlank()) {
            // Delete post image resource from cloudinary
            uploadService.deleteCloudinaryImageResourceByPublicId(postImageUploadId, true);
        }
    }

}