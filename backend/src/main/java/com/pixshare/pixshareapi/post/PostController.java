package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.comment.CommentService;
import com.pixshare.pixshareapi.dto.PostDTO;
import com.pixshare.pixshareapi.dto.PostDTOMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    private final CommentService commentService;

    private final PostDTOMapper postDTOMapper;

    public PostController(PostService postService, CommentService commentService, PostDTOMapper postDTOMapper) {
        this.postService = postService;
        this.commentService = commentService;
        this.postDTOMapper = postDTOMapper;
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

}
