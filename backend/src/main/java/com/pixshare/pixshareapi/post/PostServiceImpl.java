package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.comment.CommentService;
import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.upload.UploadSignatureRequest;
import com.pixshare.pixshareapi.upload.UploadType;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import com.pixshare.pixshareapi.util.AppConstants;
import com.pixshare.pixshareapi.util.ImageUtil;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    private final UserService userService;

    private final CommentService commentService;

    private final UploadService uploadService;

    private final ImageUtil imageUtil;

    private final UserRepository userRepository;

    private final ValidationUtil validationUtil;

    private final PostDTOMapper postDTOMapper;


    public PostServiceImpl(PostRepository postRepository, UserService userService, CommentService commentService, UploadService uploadService, ImageUtil imageUtil, UserRepository userRepository, ValidationUtil validationUtil, PostDTOMapper postDTOMapper) {
        this.postRepository = postRepository;
        this.userService = userService;
        this.commentService = commentService;
        this.uploadService = uploadService;
        this.imageUtil = imageUtil;
        this.userRepository = userRepository;
        this.validationUtil = validationUtil;
        this.postDTOMapper = postDTOMapper;
    }

    @Override
    @Transactional
    public void createPost(PostRequest postRequest, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        // Create post
        Post post = new Post(
                postRequest.caption(),
                "",
                "",
                postRequest.location(),
                ZonedDateTime.now(),
                user
        );

        validationUtil.performValidation(post);
        Post savedPost = postRepository.save(post);

        updatePostImage(savedPost.getId(), user.getId(), postRequest.image());
    }

    @Override
    public void updatePostImage(Long postId, Long userId, MultipartFile imageFile) throws ResourceNotFoundException, UnauthorizedActionException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        Long postUserId = post.getUser().getId();

        if (!postUserId.equals(userId)) {
            throw new UnauthorizedActionException("You can't edit other user's post");
        }

        // Get image bytes from image file
        byte[] imageBytes = imageUtil.getImageBytesFromMultipartFile(imageFile);

        // Upload post image to cloudinary and get the public ID and secure URL
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(post.getId(), UploadType.POST.name());
        Map<String, String> uploadedImageResult = uploadService.uploadImageResourceToCloudinary(userId, imageBytes, signatureRequest);
        String publicId = uploadedImageResult.get("publicId");
        String secureUrl = uploadedImageResult.get("secureUrl");

        // Update post imageUploadId and image with the public ID and secure URL from cloudinary
        post.setImageUploadId(publicId);
        post.setImage(secureUrl);
        postRepository.save(post);
    }


    @Override
    @Transactional
    public void deletePost(Long postId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException {
        PostDTO post = findPostById(postId, userId);
        UserSummaryDTO user = userService.findUserById(userId, userId);
        Long postUserId = post.getUser().getId();

        if (!postUserId.equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's post");
        }

        // Delete the comments associated with the post
        commentService.deleteCommentsByPostId(postId);

        removePostImageResource(post.getImageUploadId());
        postRepository.deleteById(post.getId());
    }


    @Override
    public PostDTO findPostById(Long postId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        PostDTO post = postRepository.findById(postId)
                .map(postDTOMapper)
                .map(postDTO -> {
                    postDTO.setComments(
                            commentService.findCommentsByPostId(postDTO.getId(), user.getId())
                    );
                    postDTO.setIsLikedByAuthUser(
                            isPostLikedByUser(postDTO.getId(), user.getId())
                    );
                    postDTO.setIsSavedByAuthUser(
                            isPostSavedByUser(postDTO.getId(), user.getId())
                    );
                    return postDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        return post;
    }

    @Override
    public PagedResponse<PostDTO> findPostsByUserId(Long authUserId, Long userId, PageRequestDTO pageRequest) {
        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        Page<Post> pagedPosts = postRepository.findPostsByUserId(userId, pageable);

        // get posts content from Page
        List<PostDTO> content = pagedPosts
                .getContent()
                .stream()
                .map(postDTOMapper)
                .peek(postDTO -> {
                    postDTO.setComments(
                            commentService.findCommentsByPostId(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsLikedByAuthUser(
                            isPostLikedByUser(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsSavedByAuthUser(
                            isPostSavedByUser(postDTO.getId(), authUserId)
                    );
                })
                .toList();


        return new PagedResponse<>(
                content,
                pagedPosts.getNumber(),
                pagedPosts.getSize(),
                pagedPosts.getTotalElements(),
                pagedPosts.getTotalPages(),
                pagedPosts.isLast());
    }

    @Override
    public PagedResponse<PostDTO> findAllPostsByUserIds(Long authUserId, List<Long> userIds, PageRequestDTO pageRequest) {
        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        Page<Post> pagedPosts = postRepository.findAllPostsByUserIds(userIds, pageable);

        // get posts content from Page
        List<PostDTO> content = pagedPosts
                .getContent()
                .stream()
                .map(postDTOMapper)
                .peek(postDTO -> {
                    postDTO.setComments(
                            commentService.findCommentsByPostId(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsLikedByAuthUser(
                            isPostLikedByUser(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsSavedByAuthUser(
                            isPostSavedByUser(postDTO.getId(), authUserId)
                    );
                })
                .toList();

        return new PagedResponse<>(
                content,
                pagedPosts.getNumber(),
                pagedPosts.getSize(),
                pagedPosts.getTotalElements(),
                pagedPosts.getTotalPages(),
                pagedPosts.isLast());
    }

    @Override
    public PagedResponse<PostDTO> findAllPosts(Long authUserId, PageRequestDTO pageRequest) {
        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        Page<Post> pagedPosts = postRepository.findAllPosts(pageable);

        // get posts content from Page
        List<PostDTO> content = pagedPosts
                .getContent()
                .stream()
                .map(postDTOMapper)
                .peek(postDTO -> {
                    postDTO.setComments(
                            commentService.findCommentsByPostId(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsLikedByAuthUser(
                            isPostLikedByUser(postDTO.getId(), authUserId)
                    );
                    postDTO.setIsSavedByAuthUser(
                            isPostSavedByUser(postDTO.getId(), authUserId)
                    );
                })
                .toList();

        return new PagedResponse<>(
                content,
                pagedPosts.getNumber(),
                pagedPosts.getSize(),
                pagedPosts.getTotalElements(),
                pagedPosts.getTotalPages(),
                pagedPosts.isLast());
    }

    @Override
    public PagedResponse<PostDTO> findAllPostsPublic(PageRequestDTO pageRequest) {
        int pageLimit = AppConstants.DEFAULT_PAGE_LIMIT;

        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        int actualPage = Math.min(pageable.getPageNumber(), pageLimit - 1); // Adjust for 0-based indexing
        Pageable adjustedPageable = PageRequest.of(actualPage, pageable.getPageSize(), pageable.getSort());

        Page<Post> pagedPosts = postRepository.findAllPosts(adjustedPageable);
        int maxElements = pageLimit * pageable.getPageSize();
        long totalRecords = Math.min(pagedPosts.getTotalElements(), maxElements);
        int totalPages = Math.min(pagedPosts.getTotalPages(), pageLimit);
        boolean isLastPage = (actualPage == pageLimit - 1) || pagedPosts.isLast();

        // get posts content from Page
        List<PostDTO> content = pagedPosts
                .getContent()
                .stream()
                .map(postDTOMapper)
                .peek(postDTO -> postDTO.setComments(
                        commentService.findCommentsByPostIdPublic(postDTO.getId())
                ))
                .toList();


        return new PagedResponse<>(
                content,
                pagedPosts.getNumber(),
                pagedPosts.getSize(),
                totalRecords,
                totalPages,
                isLastPage
        );
    }

    @Override
    public PagedResponse<PostDTO> findSavedPostsByUserId(Long userId, PageRequestDTO pageRequest) {
        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        Page<Post> pagedSavedPosts = postRepository.findSavedPostsByUserId(userId, pageable);

        // get saved posts content from Page
        List<PostDTO> content = pagedSavedPosts
                .getContent()
                .stream()
                .map(postDTOMapper)
                .peek(postDTO -> {
                    postDTO.setComments(
                            commentService.findCommentsByPostId(postDTO.getId(), userId)
                    );
                    postDTO.setIsLikedByAuthUser(
                            isPostLikedByUser(postDTO.getId(), userId)
                    );
                    postDTO.setIsSavedByAuthUser(
                            isPostSavedByUser(postDTO.getId(), userId)
                    );
                })
                .toList();


        return new PagedResponse<>(
                content,
                pagedSavedPosts.getNumber(),
                pagedSavedPosts.getSize(),
                pagedSavedPosts.getTotalElements(),
                pagedSavedPosts.getTotalPages(),
                pagedSavedPosts.isLast());
    }


    @Override
    public void savePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Boolean isPostSaved = postRepository.isPostSavedByUser(post.getId(), user.getId());

        if (!isPostSaved) {
            user.addSavedPost(post);
            userRepository.save(user);
        }
    }

    @Override
    public void unsavePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Boolean isPostSaved = postRepository.isPostSavedByUser(post.getId(), user.getId());

        if (isPostSaved) {
            user.removeSavedPost(post);
            userRepository.save(user);
        }
    }

    @Override
    public PostDTO likePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Boolean isPostLiked = postRepository.isPostLikedByUser(post.getId(), user.getId());
        Boolean isPostSaved = postRepository.isPostSavedByUser(post.getId(), user.getId());

        if (!isPostLiked) {
            post.getLikedByUsers().add(user);
            postRepository.save(post);
        }

        PostDTO postDTO = postDTOMapper.apply(post);
        postDTO.setComments(commentService.findCommentsByPostId(post.getId(), userId));
        postDTO.setIsLikedByAuthUser(true);
        postDTO.setIsSavedByAuthUser(isPostSaved);

        return postDTO;
    }

    @Override
    public PostDTO unlikePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Boolean isPostLiked = postRepository.isPostLikedByUser(post.getId(), user.getId());
        Boolean isPostSaved = postRepository.isPostSavedByUser(post.getId(), user.getId());

        if (isPostLiked) {
            post.getLikedByUsers().remove(user);
            postRepository.save(post);
        }

        PostDTO postDTO = postDTOMapper.apply(post);
        postDTO.setComments(commentService.findCommentsByPostId(post.getId(), userId));
        postDTO.setIsLikedByAuthUser(false);
        postDTO.setIsSavedByAuthUser(isPostSaved);

        return postDTO;
    }

    @Override
    public Boolean isPostLikedByUser(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        return postRepository.isPostLikedByUser(post.getId(), user.getId());
    }

    @Override
    public Boolean isPostSavedByUser(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        return postRepository.isPostSavedByUser(post.getId(), user.getId());
    }

    private void removePostImageResource(String postImageUploadId) {
        if (postImageUploadId != null && !postImageUploadId.isBlank()) {
            // Delete post image resource from cloudinary
            uploadService.deleteCloudinaryImageResourceByPublicId(postImageUploadId, true);
        }
    }

}
