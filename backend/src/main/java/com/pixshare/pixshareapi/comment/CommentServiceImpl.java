package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.dto.CommentDTOMapper;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.user.RoleName;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final ValidationUtil validationUtil;

    private final CommentDTOMapper commentDTOMapper;

    public CommentServiceImpl(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository, ValidationUtil validationUtil, CommentDTOMapper commentDTOMapper) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.validationUtil = validationUtil;
        this.commentDTOMapper = commentDTOMapper;
    }

    @Override
    public void createComment(CommentRequest commentRequest, Long postId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Post post = postRepository.findByIdAndUser_Role(postId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        Comment comment = new Comment(
                commentRequest.content(),
                ZonedDateTime.now(),
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
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's comment");
        }

        commentRepository.deleteById(comment.getId());
    }

    @Override
    public CommentDTO findCommentById(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        CommentDTO comment = commentRepository.findByIdAndUser_Role(commentId, RoleName.USER.name())
                .map(commentDTOMapper)
                .map(commentDTO -> {
                    commentDTO.setIsLikedByAuthUser(
                            commentRepository.isCommentLikedByUserAndUser_Role(
                                    commentDTO.getId(), user.getId(), RoleName.USER.name())
                    );
                    return commentDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));


        return comment;
    }

    @Override
    public List<CommentDTO> findCommentsByPostId(Long postId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        List<CommentDTO> comments = commentRepository.findCommentsByPostIdAndUser_Role(
                        postId, RoleName.USER.name(), Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(commentDTOMapper)
                .peek(commentDTO -> commentDTO.setIsLikedByAuthUser(
                        commentRepository.isCommentLikedByUserAndUser_Role(
                                commentDTO.getId(), user.getId(), RoleName.USER.name())
                ))
                .toList();

        return comments;
    }

    @Override
    public List<CommentDTO> findCommentsByPostIdPublic(Long postId) {
        List<CommentDTO> comments = commentRepository.findCommentsByPostIdAndUser_Role(
                        postId, RoleName.USER.name(), Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(commentDTOMapper)
                .toList();

        return comments;
    }

    @Override
    public CommentDTO likeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Comment comment = commentRepository.findByIdAndUser_Role(commentId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));
        Boolean isCommentLiked = commentRepository.isCommentLikedByUserAndUser_Role(
                comment.getId(), user.getId(), RoleName.USER.name());

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
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Comment comment = commentRepository.findByIdAndUser_Role(commentId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));
        Boolean isCommentLiked = commentRepository.isCommentLikedByUserAndUser_Role(
                comment.getId(), user.getId(), RoleName.USER.name());

        if (isCommentLiked) {
            comment.getLikedByUsers().remove(user);
            commentRepository.save(comment);
        }

        CommentDTO commentDTO = commentDTOMapper.apply(comment);
        commentDTO.setIsLikedByAuthUser(!isCommentLiked ? isCommentLiked : false);

        return commentDTO;
    }

}
