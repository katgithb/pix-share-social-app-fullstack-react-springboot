package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.comment.CommentService;
import com.pixshare.pixshareapi.dto.PostDTO;
import com.pixshare.pixshareapi.dto.PostDTOMapper;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.upload.UploadSignatureRequest;
import com.pixshare.pixshareapi.upload.UploadType;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import com.pixshare.pixshareapi.util.ImageUtil;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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
                LocalDateTime.now(),
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
        PostDTO post = findPostById(postId);
        UserDTO user = userService.findUserById(userId);
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
    public List<PostDTO> findPostsByUserId(Long userId) throws ResourceNotFoundException {
        List<PostDTO> posts = postRepository.findByUserId(userId).stream()
                .map(postDTOMapper)
                .toList();

        return posts;
    }

    @Override
    public PostDTO findPostById(Long postId) throws ResourceNotFoundException {
        PostDTO post = postRepository.findById(postId)
                .map(postDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        return post;
    }

    @Override
    public List<PostDTO> findAllPostsByUserIds(List<Long> userIds) throws ResourceNotFoundException {
        List<PostDTO> posts = postRepository.findAllPostsByUserIds(userIds,
                        Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(postDTOMapper)
                .toList();

        return posts;
    }

    @Override
    public void savePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        if (!user.getSavedPosts().contains(post)) {
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

        if (user.getSavedPosts().contains(post)) {
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

        post.getLikedByUsers().add(user);

        return postDTOMapper.apply(postRepository.save(post));
    }

    @Override
    public PostDTO unlikePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        post.getLikedByUsers().remove(user);

        return postDTOMapper.apply(postRepository.save(post));
    }

    private void removePostImageResource(String postImageUploadId) {
        if (postImageUploadId != null && !postImageUploadId.isBlank()) {
            // Delete post image resource from cloudinary
            uploadService.deleteCloudinaryImageResourceByPublicId(postImageUploadId, true);
        }
    }

}
