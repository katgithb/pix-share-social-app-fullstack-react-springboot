package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import com.pixshare.pixshareapi.user.UserView;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    private final UserService userService;

    private final UserRepository userRepository;

    public PostServiceImpl(PostRepository postRepository, UserService userService, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public void createPost(Post post, Long userId) throws ResourceNotFoundException {
        User user = userService.findUserById(userId);

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());

        postRepository.save(post);
    }

    @Override
    public void deletePost(Long postId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (!post.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's post");
        }

        postRepository.deleteById(post.getId());
    }

    @Override
    public List<Post> findPostsByUserId(Long userId) throws ResourceNotFoundException {
        List<Post> posts = postRepository.findByUserId(userId);

        return posts;
    }

    @Override
    public Post findPostById(Long postId) throws ResourceNotFoundException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

        return post;
    }

    @Override
    public List<Post> findAllPostsByUserIds(List<Long> userIds) throws ResourceNotFoundException {
        List<Post> posts = postRepository.findAllPostsByUserIds(userIds,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return posts;
    }

    @Override
    public void savePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (!user.getSavedPosts().contains(post)) {
            user.getSavedPosts().add(post);
            userRepository.save(user);
        }
    }

    @Override
    public void unsavePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post);
            userRepository.save(user);
        }
    }

    @Override
    public Post likePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        UserView userView = new UserView();
        userView.setId(user.getId());
        userView.setUsername(user.getUsername());
        userView.setEmail(user.getEmail());
        userView.setName(user.getName());
        userView.setUserImage(user.getUserImage());

        post.getLikedByUsers().add(userView);

        return postRepository.save(post);
    }

    @Override
    public Post unlikePost(Long postId, Long userId) throws ResourceNotFoundException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        UserView userView = new UserView();
        userView.setId(user.getId());
        userView.setUsername(user.getUsername());
        userView.setEmail(user.getEmail());
        userView.setName(user.getName());
        userView.setUserImage(user.getUserImage());

        post.getLikedByUsers().remove(userView);

        return postRepository.save(post);
    }
}
