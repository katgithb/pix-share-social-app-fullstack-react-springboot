package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;

    private final UserService userService;

    private final CommentDTOMapper commentDTOMapper;

    public CommentController(CommentService commentService, UserService userService, CommentDTOMapper commentDTOMapper) {
        this.commentService = commentService;
        this.userService = userService;
        this.commentDTOMapper = commentDTOMapper;
    }

    @PostMapping("/create/{postId}")
    public void createComment(
            @RequestBody Comment comment,
            @PathVariable("postId") Long postId) {
        User user = userService.findUserByUsername("taylor");
        commentService.createComment(comment, postId, user.getId());
    }

    @GetMapping("/id/{commentId}")
    public ResponseEntity<CommentDTO> findCommentById(@PathVariable("commentId") Long commentId) {
        CommentDTO comment = commentDTOMapper.apply(
                commentService.findCommentById(commentId));

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping("/all/{postId}")
    public ResponseEntity<List<CommentDTO>> findCommentsByPostId(@PathVariable("postId") Long postId) {
        List<CommentDTO> comments = commentService.findCommentsByPostId(postId).stream()
                .map(commentDTOMapper)
                .toList();

        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
}
