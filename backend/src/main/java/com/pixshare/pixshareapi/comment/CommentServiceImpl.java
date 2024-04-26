package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.dto.CommentDTOMapper;
import com.pixshare.pixshareapi.dto.UserSummaryDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final UserService userService;

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final ValidationUtil validationUtil;

    private final CommentDTOMapper commentDTOMapper;

    public CommentServiceImpl(CommentRepository commentRepository, UserService userService, UserRepository userRepository, PostRepository postRepository, ValidationUtil validationUtil, CommentDTOMapper commentDTOMapper) {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.validationUtil = validationUtil;
        this.commentDTOMapper = commentDTOMapper;
    }

    @Override
    public void createComment(CommentRequest commentRequest, Long postId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        Comment comment = new Comment(
                commentRequest.content(),
                LocalDateTime.now(),
                user,
                post);

        validationUtil.performValidation(comment);
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void deleteCommentsByPostId(Long postId) {
        commentRepository.deleteByPostId(postId);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException {
        CommentDTO comment = findCommentById(commentId, userId);
        UserSummaryDTO user = userService.findUserById(userId, userId);

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's comment");
        }

        commentRepository.deleteById(comment.getId());
    }

    @Override
    public CommentDTO findCommentById(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        CommentDTO comment = commentRepository.findById(commentId)
                .map(commentDTOMapper)
                .map(commentDTO -> {
                    commentDTO.setIsLikedByAuthUser(
                            commentRepository.isCommentLikedByUser(commentDTO.getId(), user.getId())
                    );
                    return commentDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));


        return comment;
    }

    @Override
    public List<CommentDTO> findCommentsByPostId(Long postId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        List<CommentDTO> comments = commentRepository.findCommentsByPostId(postId,
                        Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(commentDTOMapper)
                .peek(commentDTO -> commentDTO.setIsLikedByAuthUser(
                        commentRepository.isCommentLikedByUser(commentDTO.getId(), user.getId())
                ))
                .toList();

        return comments;
    }

    @Override
    public List<CommentDTO> findCommentsByPostIdPublic(Long postId) {
        List<CommentDTO> comments = commentRepository.findCommentsByPostId(postId,
                        Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(commentDTOMapper)
                .toList();

        return comments;
    }

    @Override
    public CommentDTO likeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));
        Boolean isCommentLiked = commentRepository.isCommentLikedByUser(comment.getId(), user.getId());

        if (!isCommentLiked) {
            comment.getLikedByUsers().add(user);
            commentRepository.save(comment);
        }

        CommentDTO commentDTO = commentDTOMapper.apply(comment);
        commentDTO.setIsLikedByAuthUser(isCommentLiked ? isCommentLiked : true);

        return commentDTO;
    }

    @Override
    public CommentDTO unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));
        Boolean isCommentLiked = commentRepository.isCommentLikedByUser(comment.getId(), user.getId());

        if (isCommentLiked) {
            comment.getLikedByUsers().remove(user);
            commentRepository.save(comment);
        }

        CommentDTO commentDTO = commentDTOMapper.apply(comment);
        commentDTO.setIsLikedByAuthUser(!isCommentLiked ? isCommentLiked : false);

        return commentDTO;
    }

}
