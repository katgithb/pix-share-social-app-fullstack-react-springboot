package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.comment.CommentService;
import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
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
            @ModelAttribute PostRequest request,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);

        postService.createPost(request, identity.getId());
    }

    @GetMapping("/id/{postId}")
    public ResponseEntity<PostDTO> findPostById(
            @PathVariable("postId") Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PostDTO post = postService.findPostById(postId, identity.getId());

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<PagedResponse<PostDTO>> findPostsByUserId(
            @PathVariable("userId") Long userId,
            @ModelAttribute PageRequestDTO pageRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PagedResponse<PostDTO> postResponse = postService.findPostsByUserId(identity.getId(), userId, pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping("/following/{userIds}")
    public ResponseEntity<PagedResponse<PostDTO>> findAllPostsByUserIds(
            @PathVariable("userIds") List<Long> userIds,
            @ModelAttribute PageRequestDTO pageRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PagedResponse<PostDTO> postResponse = postService.findAllPostsByUserIds(identity.getId(), userIds, pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<PagedResponse<PostDTO>> findAllPosts(
            @ModelAttribute PageRequestDTO pageRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PagedResponse<PostDTO> postResponse = postService.findAllPosts(identity.getId(), pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping("/public/all")
    public ResponseEntity<PagedResponse<PostDTO>> findAllPostsPublic(
            @ModelAttribute PageRequestDTO pageRequest) {
        PagedResponse<PostDTO> postResponse = postService.findAllPostsPublic(pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
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

    @GetMapping("/{postId}/isLiked")
    public ResponseEntity<Boolean> isPostLikedByCurrentUser(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        boolean isLiked = postService.isPostLikedByUser(postId, identity.getId());

        return new ResponseEntity<>(isLiked, HttpStatus.OK);
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

    @GetMapping("/{postId}/isSaved")
    public ResponseEntity<Boolean> isPostSavedByCurrentUser(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        boolean isSaved = postService.isPostSavedByUser(postId, identity.getId());

        return new ResponseEntity<>(isSaved, HttpStatus.OK);
    }

}
