package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.comment.CommentService;
import com.pixshare.pixshareapi.dto.PostDTO;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    private final CommentService commentService;

    private final AuthenticationService authenticationService;

    public PostController(PostService postService, CommentService commentService, AuthenticationService authenticationService) {
        this.postService = postService;
        this.commentService = commentService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/create")
    public void createPost(
            @RequestBody PostRequest request,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        postService.createPost(request, identity.getId());
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<PostDTO>> findPostsByUserId(@PathVariable("userId") Long userId) {
        List<PostDTO> posts = postService.findPostsByUserId(userId).stream()
                .peek(postDTO -> postDTO.setComments(
                        commentService.findCommentsByPostId(postDTO.getId())
                ))
                .toList();

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/id/{postId}")
    public ResponseEntity<PostDTO> findPostById(@PathVariable("postId") Long postId) {
        PostDTO post = postService.findPostById(postId);
        post.setComments(
                commentService.findCommentsByPostId(postId)
        );

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/following/{userIds}")
    public ResponseEntity<List<PostDTO>> findAllPostsByUserIds(@PathVariable("userIds") List<Long> userIds) {
        List<PostDTO> posts = postService.findAllPostsByUserIds(userIds).stream()
                .peek(postDTO -> postDTO.setComments(
                        commentService.findCommentsByPostId(postDTO.getId())
                ))
                .toList();

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{postId}")
    public void deletePost(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        postService.deletePost(postId, identity.getId());
    }

    @PutMapping("/like/{postId}")
    public ResponseEntity<PostDTO> likePost(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PostDTO post = postService.likePost(postId, identity.getId());

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/unlike/{postId}")
    public ResponseEntity<PostDTO> unlikePost(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PostDTO post = postService.unlikePost(postId, identity.getId());

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/save_post/{postId}")
    public void savePost(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        postService.savePost(postId, identity.getId());
    }

    @PutMapping("/unsave_post/{postId}")
    public void unsavePost(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        postService.unsavePost(postId, identity.getId());
    }

}
