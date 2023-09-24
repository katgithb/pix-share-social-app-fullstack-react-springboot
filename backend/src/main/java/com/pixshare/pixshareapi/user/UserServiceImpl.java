package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.CommentRepository;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserDTOMapper;
import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.story.StoryRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final CommentRepository commentRepository;

    private final StoryRepository storyRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserDTOMapper userDTOMapper;

    public UserServiceImpl(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository,
                           StoryRepository storyRepository, PasswordEncoder passwordEncoder, UserDTOMapper userDTOMapper) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.storyRepository = storyRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDTOMapper = userDTOMapper;
    }

    @Override
    public boolean existsUserWithId(Long userId) {
        return userRepository.existsUserById(userId);
    }

    @Override
    public boolean existsUserWithEmail(String email) {
        return userRepository.existsUserByEmail(email);
    }

    @Override
    public boolean existsUserWithUserHandleName(String username) {
        return userRepository.existsUserByUserHandleName(username);
    }

    @Override
    public void registerUser(UserRegistrationRequest registrationRequest) throws DuplicateResourceException {
        // check if email exists
        String email = registrationRequest.email();
        if (existsUserWithEmail(email)) {
            throw new DuplicateResourceException("This email is already taken");
        }

        // check if username exists
        String username = registrationRequest.username();
        if (existsUserWithUserHandleName(username)) {
            throw new DuplicateResourceException("This username is already taken");
        }

        // save
        User user = new User(registrationRequest.username(),
                registrationRequest.email(),
                passwordEncoder.encode(registrationRequest.password()),
                registrationRequest.name(),
                registrationRequest.gender());
        userRepository.save(user);
    }

    @Override
    public boolean verifyPassword(Long userId, String password) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public void updatePassword(Long userId, String newPassword) throws ResourceNotFoundException, RequestValidationException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        String password = user.getPassword();

        // Check if the new password is different from the current password
        if (passwordEncoder.matches(newPassword, password)) {
            throw new RequestValidationException("New password must not be the same as the current password");
        }

        // update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException, DuplicateResourceException, RequestValidationException {
        // can be used to avoid database query
        // User user = userRepository.getReferenceById(userId)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        if (existsUserWithEmail(updateRequest.email())) {
            throw new DuplicateResourceException("This email is already taken");
        }

        if (existsUserWithUserHandleName(updateRequest.username())) {
            throw new DuplicateResourceException("This username is already taken");
        }

        Map<Object, Map<Object, Consumer<User>>> fieldUpdateMap = populateFieldUpdateMap(updateRequest, user);

        boolean changes = fieldUpdateMap.values()
                .stream()
                .map(entry -> entry.values().stream().findFirst().map(action -> {
                                    action.accept(user);
                                    return true;
                                })
                                .orElse(false)
                )
                .reduce(false, (accumulator, change) -> accumulator || change);

        if (!changes) {
            throw new RequestValidationException("No changes found");
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        removeUserFromLikedComments(user);
        removeUserFromLikedPosts(user);

        removeSavedPostsByUser(user);
        removeUserFromFollowers(user);

        // Delete the stories associated with the user
        storyRepository.deleteByUserId(user.getId());

        deleteCommentsOnPostsByUser(user);
        // Delete the comments associated with the user
        commentRepository.deleteByUserId(user.getId());

        // Delete the posts associated with the user
        postRepository.deleteByUserId(user.getId());

        userRepository.deleteById(user.getId());
    }

    @Override
    public UserDTO findUserById(Long userId) throws ResourceNotFoundException {
        return userRepository.findById(userId)
                .map(userDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
    }

    @Override
    public UserDTO findUserByEmail(String email) throws ResourceNotFoundException {
        UserDTO user = userRepository.findByEmail(email)
                .map(userDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return user;
    }

    @Override
    public UserDTO findUserByUsername(String username) throws ResourceNotFoundException {
        UserDTO user = userRepository.findByUserHandleName(username)
                .map(userDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return user;
    }

    @Override
    public String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(reqUserId)));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(followUserId)));

        if (reqUserId.equals(followUserId)) {
            throw new RequestValidationException("Invalid Request: You cannot follow your own profile.");
        }

        followUser.addFollower(reqUser);

        userRepository.save(reqUser);
        userRepository.save(followUser);

        return "You are following " + followUser.getUserHandleName();
    }

    @Override
    public String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(reqUserId)));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(followUserId)));

        if (reqUserId.equals(followUserId)) {
            throw new RequestValidationException("Invalid Request: You cannot unfollow your own profile.");
        }

        followUser.removeFollower(reqUser);

        userRepository.save(reqUser);
        userRepository.save(followUser);


        return "You have unfollowed " + followUser.getUserHandleName();
    }

    @Override
    public List<UserDTO> findUserByIds(List<Long> userIds) throws ResourceNotFoundException {
        List<UserDTO> users = userRepository.findAllUsersByUserIds(userIds).stream()
                .map(userDTOMapper)
                .collect(Collectors.collectingAndThen(Collectors.toList(), result -> {
                    if (result.isEmpty()) throw new ResourceNotFoundException("User not found");
                    return result;
                }));

        return users;
    }

    @Override
    public List<UserDTO> searchUser(String searchQuery) throws ResourceNotFoundException {
        List<UserDTO> users = userRepository.findByQuery(searchQuery).stream()
                .map(userDTOMapper)
                .collect(Collectors.collectingAndThen(Collectors.toList(), result -> {
                    if (result.isEmpty()) throw new ResourceNotFoundException("User not found");
                    return result;
                }));

        return users;
    }

    @Override
    public List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException {
        User reqUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        List<UserDTO> users = userRepository.findPopularUsers(reqUser.getId()).stream()
                .map(userDTOMapper)
                .toList();

        return users;
    }

    private boolean isFieldValueChanged(Object newValue, Object currentValue) {
        return Optional.ofNullable(newValue)
                .filter(value -> !value.equals(currentValue))
                .isPresent();
    }

    // Helper method to create field update entries
    private <T> Map.Entry<Object, Map<Object, Consumer<User>>> fieldUpdateEntry(T reqField, T userField, Consumer<User> consumer) {
        Object key = reqField != null && !reqField.toString().trim().isEmpty() ? reqField : UUID.randomUUID().toString();

        return isFieldValueChanged(reqField, userField)
                ? Map.entry(key, Collections.singletonMap(userField, consumer))
                : null;
    }

    private Map<Object, Map<Object, Consumer<User>>> populateFieldUpdateMap(UserUpdateRequest updateRequest, User user) {
        return Optional.ofNullable(updateRequest)
                .map(req -> Stream.of(
                                fieldUpdateEntry(req.username(), user.getUserHandleName(), c -> c.setUserHandleName(req.username())),
                                fieldUpdateEntry(req.email(), user.getEmail(), c -> c.setEmail(req.email())),
                                fieldUpdateEntry(req.name(), user.getName(), c -> c.setName(req.name())),
                                fieldUpdateEntry(req.mobile(), user.getMobile(), c -> c.setMobile(req.mobile())),
                                fieldUpdateEntry(req.website(), user.getWebsite(), c -> c.setWebsite(req.website())),
                                fieldUpdateEntry(req.bio(), user.getBio(), c -> c.setBio(req.bio())),
                                fieldUpdateEntry(req.gender(), user.getGender(), c -> c.setGender(req.gender())),
                                fieldUpdateEntry(req.userImageUploadId(), user.getUserImageUploadId(), c -> c.setUserImageUploadId(req.userImageUploadId())),
                                fieldUpdateEntry(req.userImage(), user.getUserImage(), c -> c.setUserImage(req.userImage()))
                        )
                        .filter(Objects::nonNull)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)))
                .orElse(Collections.emptyMap());
    }

    private void removeUserFromLikedComments(User user) {
        commentRepository.findLikedCommentsByUserId(user.getId())
                .forEach(comment -> {
                    comment.getLikedByUsers().removeIf(u -> u.equals(user));
                    commentRepository.save(comment);
                });
    }

    private void removeUserFromLikedPosts(User user) {
        postRepository.findLikedPostsByUserId(user.getId())
                .forEach(post -> {
                    post.getLikedByUsers().removeIf(u -> u.equals(user));
                    postRepository.save(post);
                });
    }

    private void removeSavedPostsByUser(User user) {
        List<Post> savedPostsByUser = new ArrayList<>(user.getSavedPosts());
        savedPostsByUser.forEach(user::removeSavedPost);
    }

    private void removeUserFromFollowers(User user) {
        List<User> userFollowings = new ArrayList<>(user.getFollowing());
        userFollowings.forEach(u -> u.removeFollower(user));
    }

    private void deleteCommentsOnPostsByUser(User user) {
        List<Long> postIds = postRepository.findByUserId(user.getId())
                .stream()
                .map(Post::getId)
                .collect(Collectors.toList());

        commentRepository.deleteByPostIds(postIds);
    }

}
