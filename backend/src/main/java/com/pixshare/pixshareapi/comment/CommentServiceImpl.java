package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.post.PostService;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserService;
import com.pixshare.pixshareapi.user.UserView;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    private final UserService userService;

    private final PostService postService;

    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository commentRepository, UserService userService, PostService postService, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.postService = postService;
        this.postRepository = postRepository;
    }

    @Override
    public void createComment(Comment comment, Long postId, Long userId) throws ResourceNotFoundException {
        User user = userService.findUserById(userId);
        Post post = postService.findPostById(postId);

        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());

        Comment createdComment = commentRepository.save(comment);
        post.getComments().add(createdComment);
        postRepository.save(post);
    }

    @Override
    public Comment findCommentById(Long commentId) throws ResourceNotFoundException {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment with id [%s] not found".formatted(commentId)));

        return comment;
    }

    @Override
    public List<Comment> findCommentsByPostId(Long postId) throws ResourceNotFoundException {
        List<Comment> comments = commentRepository.findCommentsByPostId(postId);

        return comments;
    }

    @Override
    public Comment likeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userService.findUserById(userId);
        Comment comment = findCommentById(commentId);

        UserView userView = new UserView();
        userView.setId(user.getId());
        userView.setUsername(user.getUsername());
        userView.setEmail(user.getEmail());
        userView.setName(user.getName());
        userView.setUserImage(user.getUserImage());

        comment.getLikedByUsers().add(userView);

        return commentRepository.save(comment);
    }

    @Override
    public Comment unlikeComment(Long commentId, Long userId) throws ResourceNotFoundException {
        User user = userService.findUserById(userId);
        Comment comment = findCommentById(commentId);

        UserView userView = new UserView();
        userView.setId(user.getId());
        userView.setUsername(user.getUsername());
        userView.setEmail(user.getEmail());
        userView.setName(user.getName());
        userView.setUserImage(user.getUserImage());

        comment.getLikedByUsers().remove(userView);

        return commentRepository.save(comment);
    }

}
