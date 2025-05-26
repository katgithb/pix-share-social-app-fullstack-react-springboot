package com.pixshare.pixshareapi.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pixshare.pixshareapi.comment.CommentRepository;
import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.exception.*;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.story.Story;
import com.pixshare.pixshareapi.story.StoryRepository;
import com.pixshare.pixshareapi.story.StoryService;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.upload.UploadSignatureRequest;
import com.pixshare.pixshareapi.upload.UploadType;
import com.pixshare.pixshareapi.util.BrevoMailSender;
import com.pixshare.pixshareapi.util.HMACTokenUtil;
import com.pixshare.pixshareapi.util.ImageUtil;
import com.pixshare.pixshareapi.validation.UrlValidator;
import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sendinblue.ApiException;
import sibApi.TransactionalEmailsApi;

import java.time.Duration;
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

    private final RoleService roleService;

    private final StoryService storyService;

    private final UploadService uploadService;

    private final PasswordResetAttemptService passwordResetAttemptService;

    private final BrevoMailSender brevoMailSender;

    private final ImageUtil imageUtil;

    private final PasswordEncoder passwordEncoder;

    private final ValidationUtil validationUtil;

    private final UrlValidator urlValidator;

    private final HMACTokenUtil hmacTokenUtil;

    private final UserDTOMapper userDTOMapper;

    private final UserSummaryDTOMapper userSummaryDTOMapper;

    @Value("${app.base-url}")
    private String appBaseUrl;
    @Value("${password-reset.token.expiry-seconds}")
    private int PASSWORD_RESET_TOKEN_EXPIRATION_IN_SECONDS;
    @Value("${password-reset.attempt-window.duration-seconds}")
    private int PASSWORD_RESET_ATTEMPT_WINDOW_DURATION_IN_SECONDS;

    public UserServiceImpl(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository,
                           StoryRepository storyRepository, RoleService roleService, StoryService storyService, UploadService uploadService, PasswordResetAttemptService passwordResetAttemptService, BrevoMailSender brevoMailSender, ImageUtil imageUtil,
                           PasswordEncoder passwordEncoder, ValidationUtil validationUtil, UrlValidator urlValidator, HMACTokenUtil hmacTokenUtil, UserDTOMapper userDTOMapper, UserSummaryDTOMapper userSummaryDTOMapper) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.storyRepository = storyRepository;
        this.roleService = roleService;
        this.storyService = storyService;
        this.uploadService = uploadService;
        this.passwordResetAttemptService = passwordResetAttemptService;
        this.brevoMailSender = brevoMailSender;
        this.imageUtil = imageUtil;
        this.passwordEncoder = passwordEncoder;
        this.validationUtil = validationUtil;
        this.urlValidator = urlValidator;
        this.hmacTokenUtil = hmacTokenUtil;
        this.userDTOMapper = userDTOMapper;
        this.userSummaryDTOMapper = userSummaryDTOMapper;
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

        // Get default user role
        Role userRole = roleService.getRoleByName(RoleName.USER.name());

        // save
        validationUtil.performValidationOnField(User.class, "password", registrationRequest.password());

        User user = new User(registrationRequest.username(),
                registrationRequest.email(),
                passwordEncoder.encode(registrationRequest.password()),
                registrationRequest.name(),
                registrationRequest.gender(),
                userRole);

        List<String> omittedFields = Collections.singletonList("password");
        validationUtil.performValidation(user, omittedFields);
        userRepository.save(user);
    }

    @Override
    public boolean verifyPassword(Long userId, String password) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        // Check if the password matches
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

        // Update password
        validationUtil.performValidationOnField(User.class, "password", newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public void initiatePasswordReset(String email) throws RequestValidationException {
        Date timestamp = new Date();
        long attemptWindowDurationHours = getDurationInHoursFromSeconds(PASSWORD_RESET_ATTEMPT_WINDOW_DURATION_IN_SECONDS);
        String formattedDurationHours = String.format("%d %s", attemptWindowDurationHours, attemptWindowDurationHours == 1 ? "hour" : "hours");

        // Check if password reset attempt allowed
        if (!passwordResetAttemptService.isPasswordResetAttemptAllowed(email, timestamp.getTime())) {
            throw new RequestValidationException("You have reached the maximum allowed attempts to reset your password. Please wait %s before trying again.".formatted(formattedDurationHours));
        }

        // Save password reset attempt
        passwordResetAttemptService.savePasswordResetAttempt(email, timestamp.getTime());

        // Check if user exists with email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return;
        }

        // Get user
        User user = userOptional.get();

        // Generate HMAC token
        String passwordResetToken = hmacTokenUtil.generateHMACToken(user.getEmail(), timestamp);

        // Send password reset email
        sendPasswordResetEmail(appBaseUrl, user.getEmail(), user.getName(), passwordResetToken);
    }

    @Override
    public boolean validatePasswordResetToken(String token) throws TokenValidationException {
        String metadata = hmacTokenUtil.extractMetadataFromToken(token);
        String identifier = hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata);
        long timestampMillis = hmacTokenUtil.extractTimestampMillisFromToken(token);

        // Check if password reset attempt has been successful before
        if (passwordResetAttemptService.isPasswordResetAttemptSuccessful(identifier, timestampMillis)) {
            throw new TokenValidationException("Password reset token is only valid to be used once. This token has already been used, so you must request a new one.");
        }

        return hmacTokenUtil.validateToken(identifier, token);
    }

    @Override
    public void resetPassword(String token, String newPassword) throws TokenValidationException {
        String metadata = hmacTokenUtil.extractMetadataFromToken(token);
        String email = hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata);
        long timestampMillis = hmacTokenUtil.extractTimestampMillisFromToken(token);

        boolean isTokenValid = validatePasswordResetToken(token);

        if (!isTokenValid) {
            throw new TokenValidationException("Invalid password reset token");
        }

        // Check if user exists with email
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return;
        }

        // Get user
        User user = userOptional.get();

        // Update password
        validationUtil.performValidationOnField(User.class, "password", newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark password reset attempt as successful
        passwordResetAttemptService.updatePasswordResetAttemptSuccess(email, timestampMillis, true);
    }

    @Override
    public void updateUserImage(Long userId, MultipartFile imageFile) throws ResourceNotFoundException, RequestValidationException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        // Get image bytes from image file
        byte[] imageBytes = imageUtil.getImageBytesFromMultipartFile(imageFile);

        // Upload user image to cloudinary and get the public ID and secure URL
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, UploadType.AVATAR.name());
        Map<String, String> uploadedImageResult = uploadService.uploadImageResourceToCloudinary(user.getId(), imageBytes, signatureRequest);
        String publicId = uploadedImageResult.get("publicId");
        String secureUrl = uploadedImageResult.get("secureUrl");

        // Update user image and userImageUploadId with the public ID and secure URL from cloudinary
        user.setUserImage(secureUrl);
        user.setUserImageUploadId(publicId);
        userRepository.save(user);
    }

    @Override
    public void removeUserImage(Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        // Delete the image resource from cloudinary by public ID
        removeUserImageResource(user.getUserImageUploadId());

        // Update user image and userImageUploadId with empty string
        user.setUserImage("");
        user.setUserImageUploadId("");
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

        removeStoryImageResourcesByUser(user);
        // Delete the stories associated with the user
        storyRepository.deleteByUserId(user.getId());

        deleteCommentsFromUserPosts(user);
        // Delete the comments associated with the user
        commentRepository.deleteByUserId(user.getId());

        removePostImageResourcesByUser(user);
        // Delete the posts associated with the user
        postRepository.deleteByUserId(user.getId());

        removeUserImageResource(user.getUserImageUploadId());
        userRepository.deleteById(user.getId());
    }

    @Override
    public UserSummaryDTO findUserById(Long authUserId, Long userId) throws ResourceNotFoundException {
        return userRepository.findById(userId)
                .map(userSummaryDTOMapper)
                .map(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), authUserId)
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                    return userDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
    }

    @Override
    public UserSummaryDTO findUserByEmail(Long authUserId, String email) throws ResourceNotFoundException {
        UserSummaryDTO user = userRepository.findByEmail(email)
                .map(userSummaryDTOMapper)
                .map(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), authUserId)
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                    return userDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return user;
    }

    @Override
    public UserSummaryDTO findUserByUsername(Long authUserId, String username) throws ResourceNotFoundException {
        UserSummaryDTO user = userRepository.findByUserHandleName(username)
                .map(userSummaryDTOMapper)
                .map(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), authUserId)
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                    return userDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return user;
    }

    @Override
    public UserDTO findUserProfile(Long authUserId) throws ResourceNotFoundException {
        UserDTO user = userRepository.findById(authUserId)
                .map(userDTOMapper)
                .map(userDTO -> {
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                    return userDTO;
                })
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(authUserId)));

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
    public List<UserSummaryDTO> findUserByIds(Long authUserId, List<Long> userIds) throws ResourceNotFoundException {
        List<UserSummaryDTO> users = userRepository.findAllUsersByUserIds(userIds).stream()
                .map(userSummaryDTOMapper)
                .peek(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), authUserId)
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), result -> {
                    if (result.isEmpty())
                        throw new ResourceNotFoundException("No users found with the provided ID(s)");
                    return result;
                }));

        return users;
    }

    @Override
    public PagedResponse<UserSummaryDTO> searchUser(Long userId, String searchQuery, PageRequestDTO pageRequest) {
        String searchQueryLowerCase = searchQuery.toLowerCase(); // Convert search query to lowercase

        // create Pageable instance
        Pageable pageable = pageRequest.toPageable();
        Page<User> pagedUsers = userRepository.findByQuery(userId, searchQueryLowerCase, pageable);

        // get users content from Page
        List<UserSummaryDTO> content = pagedUsers.getContent()
                .stream()
                .map(userSummaryDTOMapper)
                .peek(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), userId)
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                })
                .toList();

        return new PagedResponse<>(
                content,
                pagedUsers.getNumber(),
                pagedUsers.getSize(),
                pagedUsers.getTotalElements(),
                pagedUsers.getTotalPages(),
                pagedUsers.isLast());
    }

    @Override
    public List<UserSummaryDTO> findPopularUsers(Long userId) throws ResourceNotFoundException {
        User reqUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
        List<UserSummaryDTO> users = userRepository.findPopularUsers(reqUser.getId()).stream()
                .map(userSummaryDTOMapper)
                .peek(userDTO -> {
                    userDTO.setIsFollowedByAuthUser(
                            userRepository.isFollowedByUser(userDTO.getId(), reqUser.getId())
                    );
                    userDTO.setStories(
                            storyService.findStoriesByUserId(userDTO.getId())
                    );
                })
                .toList();

        return users;
    }

    @Override
    public List<UserSummaryDTO> findPopularUsersPublic() {
        List<UserSummaryDTO> users = userRepository.findPopularUsers(null).stream()
                .map(userSummaryDTOMapper)
                .toList();

        return users;
    }

    private void sendPasswordResetEmail(String baseUrl, String email, String name, String passwordResetToken) throws RequestValidationException {
        long tokenExpirationHours = getDurationInHoursFromSeconds(PASSWORD_RESET_TOKEN_EXPIRATION_IN_SECONDS);
        String formattedExpirationHours = String.format("%d %s", tokenExpirationHours, tokenExpirationHours == 1 ? "hour" : "hours");
        baseUrl = baseUrl != null ? baseUrl : "";

        // Validate base url
        if (!urlValidator.isValidUrl(baseUrl)) {
            throw new RequestValidationException("Invalid password reset base url");
        }

        // Construct password reset link with password reset token
        String passwordResetLink = baseUrl + "/reset-password/confirm?token=" + passwordResetToken;

        String subject = "Password Reset";
        Properties params = new Properties();
        params.setProperty("NAME", name);
        params.setProperty("PASSWORD_RESET_LINK", passwordResetLink);
        params.setProperty("RESET_LINK_FORMATTED_VALID_PERIOD", formattedExpirationHours);

        TransactionalEmailsApi apiInstance = brevoMailSender.getTransacEmailsApiInstance();
        // Send Transactional Email with password reset link
        try {
            brevoMailSender.sendTransactionalEmail(apiInstance, email, name, subject, params);
        } catch (ApiException e) {
            handleBrevoEmailApiException(e);
        }
    }

    private void handleBrevoEmailApiException(ApiException e) {
        String responseBody = e.getResponseBody();

        if (responseBody == null || responseBody.isBlank()) {
            throw new EmailDeliveryException("There was an unexpected error sending your password reset email. Please try requesting a new password reset link.");
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> responseMap = objectMapper.readValue(responseBody, Map.class); // Parse JSON to Map
            String code = responseMap.get("code");
            System.out.println(responseBody);

            // Check for specific codes
            if (code.equals("not_enough_credits")) {
                throw new EmailDeliveryException("Daily email limit has been reached, so we are unable to send the password reset email at this time. Please try requesting a new reset link tomorrow.");
            } else {
                throw new EmailDeliveryException("There was an unexpected error sending your password reset email. Please try requesting a new password reset link.");
            }
        } catch (JsonProcessingException ex) {
            System.out.println(ex);
            throw new EmailDeliveryException("There was an unexpected error sending your password reset email. Please try requesting a new password reset link.");
        }
    }

    private long getDurationInHoursFromSeconds(int seconds) {
        Duration duration = Duration.ofSeconds(seconds);

        return duration.toHours();
    }

    private boolean isFieldValueChanged(Object newValue, Object currentValue) {
        return Optional.ofNullable(newValue)
                .filter(value -> !value.equals(currentValue))
                .isPresent();
    }

    // Helper method to create field update entries
    private <T> Map.Entry<Object, Map<Object, Consumer<User>>> fieldUpdateEntry(String fieldName, T reqField, T userField, Consumer<User> consumer) {
        return isFieldValueChanged(reqField, userField)
                ? Map.entry(fieldName, Collections.singletonMap(userField, consumer))
                : null;
    }

    private Map<Object, Map<Object, Consumer<User>>> populateFieldUpdateMap(UserUpdateRequest updateRequest, User user) {
        return Optional.ofNullable(updateRequest)
                .map(req -> Stream.of(
                                fieldUpdateEntry("userHandleName", req.username(), user.getUserHandleName(), c -> {
                                    validationUtil.performValidationOnField(User.class, "userHandleName", req.username());
                                    c.setUserHandleName(req.username());
                                }),
                                fieldUpdateEntry("email", req.email(), user.getEmail(), c -> {
                                    validationUtil.performValidationOnField(User.class, "email", req.email());
                                    c.setEmail(req.email());
                                }),
                                fieldUpdateEntry("name", req.name(), user.getName(), c -> {
                                    validationUtil.performValidationOnField(User.class, "name", req.name());
                                    c.setName(req.name());
                                }),
                                fieldUpdateEntry("mobile", req.mobile(), user.getMobile(), c -> {
                                    validationUtil.performValidationOnField(User.class, "mobile", req.mobile());
                                    c.setMobile(req.mobile());
                                }),
                                fieldUpdateEntry("website", req.website(), user.getWebsite(), c -> {
                                    validationUtil.performValidationOnField(User.class, "website", req.website());
                                    c.setWebsite(req.website());
                                }),
                                fieldUpdateEntry("bio", req.bio(), user.getBio(), c -> {
                                    validationUtil.performValidationOnField(User.class, "bio", req.bio());
                                    c.setBio(req.bio());
                                }),
                                fieldUpdateEntry("gender", req.gender(), user.getGender(), c -> c.setGender(req.gender()))
                        )
                        .filter(Objects::nonNull)
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)))
                .orElse(Collections.emptyMap());
    }

    private void removeUserImageResource(String userImageUploadId) {
        if (userImageUploadId != null && !userImageUploadId.isBlank()) {
            // Delete user image resource from cloudinary
            uploadService.deleteCloudinaryImageResourceByPublicId(userImageUploadId, true);
        }
    }

    private void removePostImageResourcesByUser(User user) {
        List<String> postImageUploadIds = postRepository.findByUserId(user.getId())
                .stream()
                .map(Post::getImageUploadId)
                .filter(imageUploadId -> imageUploadId != null && !imageUploadId.isBlank())
                .toList();

        // Delete post image resources associated with user from cloudinary
        postImageUploadIds.forEach(postImageUploadId -> uploadService.deleteCloudinaryImageResourceByPublicId(postImageUploadId, true));
    }

    private void removeStoryImageResourcesByUser(User user) {
        List<String> storyImageUploadIds = storyRepository.findStoriesByUserId(user.getId(), Sort.unsorted())
                .stream()
                .map(Story::getImageUploadId)
                .filter(imageUploadId -> imageUploadId != null && !imageUploadId.isBlank())
                .toList();

        // Delete story image resources associated with user from cloudinary
        storyImageUploadIds.forEach(storyImageUploadId -> uploadService.deleteCloudinaryImageResourceByPublicId(storyImageUploadId, true));
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

    private void deleteCommentsFromUserPosts(User user) {
        List<Long> postIds = postRepository.findByUserId(user.getId())
                .stream()
                .map(Post::getId)
                .collect(Collectors.toList());

        commentRepository.deleteByPostIds(postIds);
    }

}
