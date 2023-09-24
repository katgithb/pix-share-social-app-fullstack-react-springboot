package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.dto.CommentDTOMapper;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
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

    private final CommentDTOMapper commentDTOMapper;

    public CommentServiceImpl(CommentRepository commentRepository, UserService userService, UserRepository userRepository, PostRepository postRepository, CommentDTOMapper commentDTOMapper) {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
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
        CommentDTO comment = findCommentById(commentId);
        UserDTO user = userService.findUserById(userId);

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's comment");
        }

        commentRepository.deleteById(comment.getId());
    }

    @Override
    public CommentDTO findCommentById(Long commentId) throws ResourceNotFoundException {
        CommentDTO comment = commentRepository.findById(commentId)
                .map(commentDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));


        return comment;
    }

    @Override
    public List<CommentDTO> findCommentsByPostId(Long postId) throws ResourceNotFoundException {
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

        comment.getLikedByUsers().add(user);

        return commentDTOMapper.apply(commentRepository.save(comment));
    }

    @Override
    public CommentDTO unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));

        comment.getLikedByUsers().remove(user);

        return commentDTOMapper.apply(commentRepository.save(comment));
    }

}
