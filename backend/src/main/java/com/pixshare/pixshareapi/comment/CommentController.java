package com.pixshare.pixshareapi.comment;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.CommentDTO;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
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
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);

        commentService.createComment(request, postId, identity.getId());
    }

    @GetMapping("/id/{commentId}")
    public ResponseEntity<CommentDTO> findCommentById(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        CommentDTO comment = commentService.findCommentById(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @GetMapping("/all/{postId}")
    public ResponseEntity<List<CommentDTO>> findCommentsByPostId(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        List<CommentDTO> comments = commentService.findCommentsByPostId(postId, identity.getId());

        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{commentId}")
    public void deleteComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        
        commentService.deleteComment(commentId, identity.getId());
    }

    @PutMapping("/like/{commentId}")
    public ResponseEntity<CommentDTO> likeComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        CommentDTO comment = commentService.likeComment(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @PutMapping("/unlike/{commentId}")
    public ResponseEntity<CommentDTO> unlikeComment(
            @PathVariable("commentId") Long commentId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        CommentDTO comment = commentService.unlikeComment(commentId, identity.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

}
