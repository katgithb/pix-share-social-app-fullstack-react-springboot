package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@Tag(name = "Comments", description = "Endpoints for managing comments")
public class CommentController {

    private final CommentService commentService;

    private final AuthenticationService authenticationService;

    public CommentController(CommentService commentService, AuthenticationService authenticationService) {
        this.commentService = commentService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/create/{postId}")
    public void createComment(
            @RequestBody CommentRequest request,
            @PathVariable("postId") Long postId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);

        commentService.createComment(request, postId, identity.getId());
    }

    @GetMapping("/id/{commentId}")
    public ResponseEntity<CommentDTO> findCommentById(
            @PathVariable("commentId") Long commentId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        CommentDTO comment = commentService.findCommentById(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping("/all/{postId}")
    public ResponseEntity<List<CommentDTO>> findCommentsByPostId(
            @PathVariable("postId") Long postId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        List<CommentDTO> comments = commentService.findCommentsByPostId(postId, identity.getId());

        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{commentId}")
    public void deleteComment(
            @PathVariable("commentId") Long commentId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);

        commentService.deleteComment(commentId, identity.getId());
    }

    @PutMapping("/like/{commentId}")
    public ResponseEntity<CommentDTO> likeComment(
            @PathVariable("commentId") Long commentId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        CommentDTO comment = commentService.likeComment(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @PutMapping("/unlike/{commentId}")
    public ResponseEntity<CommentDTO> unlikeComment(
            @PathVariable("commentId") Long commentId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        CommentDTO comment = commentService.unlikeComment(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

}
