package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.CommentRepository;
import com.pixshare.pixshareapi.dto.PostDTOMapper;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserDTOMapper;
import com.pixshare.pixshareapi.dto.UserViewMapper;
import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.story.StoryRepository;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.upload.UploadSignatureRequest;
import com.pixshare.pixshareapi.upload.UploadType;
import com.pixshare.pixshareapi.util.ImageUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    private final UserViewMapper userViewMapper = new UserViewMapper();
    private final PostDTOMapper postDTOMapper = new PostDTOMapper(userViewMapper);
    private final UserDTOMapper userDTOMapper = new UserDTOMapper(userViewMapper, postDTOMapper);
    private UserService userService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private StoryRepository storyRepository;
    @Mock
    private UploadService uploadService;
    @Mock
    private ImageUtil imageUtil;
    @Mock
    private PasswordEncoder passwordEncoder;


    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, postRepository, commentRepository, storyRepository, uploadService, imageUtil, passwordEncoder, userDTOMapper);
    }


    @Test
    @DisplayName("Should return false when user with given ID does not exist")
    void existsUserWithIdWhenUserDoesNotExist() {
        // Given
        Long userId = 1L;
        when(userRepository.existsUserById(userId)).thenReturn(false);

        // When
        boolean actual = userService.existsUserWithId(userId);

        // Then
        assertThat(actual).isFalse();
        verify(userRepository, times(1)).existsUserById(userId);
    }

    @Test
    @DisplayName("Should return true when user with given ID exists")
    void existsUserWithIdWhenUserExists() {
        // Given
        Long userId = 1L;
        when(userRepository.existsUserById(userId)).thenReturn(true);

        // When
        boolean actual = userService.existsUserWithId(userId);

        // Then
        assertThat(actual).isTrue();
        verify(userRepository, times(1)).existsUserById(userId);
    }

    @Test
    @DisplayName("Should return false when a user with the given email does not exist")
    void existsUserWithEmailWhenUserDoesNotExist() {
        // Given
        String email = "test@example.com";
        when(userRepository.existsUserByEmail(email)).thenReturn(false);

        // When
        boolean actual = userService.existsUserWithEmail(email);

        // Then
        assertThat(actual).isFalse();
        verify(userRepository, times(1)).existsUserByEmail(email);
    }

    @Test
    @DisplayName("Should return true when a user with the given email exists")
    void existsUserWithEmailWhenUserExists() {
        // Given
        String email = "test@example.com";
        when(userRepository.existsUserByEmail(email)).thenReturn(true);

        // When
        boolean actual = userService.existsUserWithEmail(email);

        // Then
        assertThat(actual).isTrue();
        verify(userRepository, times(1)).existsUserByEmail(email);
    }

    @Test
    @DisplayName("Should return false when the user with the given username does not exist")
    void existsUserWithUserHandleNameWhenUserDoesNotExist() {
        // Given
        String username = "testUser";
        when(userRepository.existsUserByUserHandleName(username)).thenReturn(false);

        // When
        boolean actual = userService.existsUserWithUserHandleName(username);

        // Then
        assertThat(actual).isFalse();
        verify(userRepository, times(1)).existsUserByUserHandleName(username);
    }

    @Test
    @DisplayName("Should return true when the user with the given username exists")
    void existsUserWithUserHandleNameWhenUserExists() {
        // Given
        String username = "john_doe";
        when(userRepository.existsUserByUserHandleName(username)).thenReturn(true);

        // When
        boolean actual = userService.existsUserWithUserHandleName(username);

        // Then
        assertThat(actual).isTrue();
        verify(userRepository, times(1)).existsUserByUserHandleName(username);
    }

    @Test
    @DisplayName("Should throw a DuplicateResourceException when the email is already taken")
    void registerUserWhenEmailIsAlreadyTakenThenThrowException() {
        // Given
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", "john.doe@example.com", "John Doe",
                "password123", Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This email is already taken");

        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should register a new user when the email is not taken")
    void registerUserWhenEmailIsNotTaken() {
        // Given
        String email = "john.doe@example.com";
        String passwordHash = "MThubHBpN3d4b2RsN2RkYzV3bW1mdnl0bm5pOGNpY2o2ZnQxZTN4ZmY2Nmk4ZW05bjJ1Y3o2ZnhleXBmOW84MzF3ZWQ4MDJsbmltNTl4amk0ZGhhNWZiOWJiN3BwemdubWM0dWJqamt4NDJuaW4wMWxzazNlOTFzY3diMjlocDM=";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", email, "John Doe",
                "password123", Gender.MALE);

        when(userRepository.existsUserByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
    }

    @Test
    @DisplayName("Should throw a DuplicateResourceException when the username is already taken")
    void registerUserWhenUserHandleNameIsAlreadyTakenThenThrowException() {
        // Given
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", "john.doe@example.com", "John Doe",
                "password123", Gender.MALE);

        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This username is already taken");

        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should register a new user when the username is not taken")
    void registerUserWhenUserHandleNameIsNotTaken() {
        // Given
        String userHandleName = "john.doe";
        String passwordHash = "MThubHBpN3d4b2RsN2RkYzV3bW1mdnl0bm5pOGNpY2o2ZnQxZTN4ZmY2Nmk4ZW05bjJ1Y3o2ZnhleXBmOW84MzF3ZWQ4MDJsbmltNTl4amk0ZGhhNWZiOWJiN3BwemdubWM0dWJqamt4NDJuaW4wMWxzazNlOTFzY3diMjlocDM=";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                userHandleName, "john.doe@example.com", "John Doe",
                "password123", Gender.MALE);

        when(userRepository.existsUserByUserHandleName(userHandleName)).thenReturn(false);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when user does not exist")
    void verifyPasswordWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.verifyPassword(userId, password))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should return false when user exists and password does not match")
    void verifyPasswordWhenUserExistsAndPasswordDoesNotMatchThenReturnsFalse() {
        // Given
        Long userId = 1L;
        String password = "password123";
        String wrongPassword = "wrongPassword";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(wrongPassword, user.getPassword())).thenReturn(false);

        // When
        boolean result = userService.verifyPassword(userId, wrongPassword);

        // Then
        verify(userRepository, times(1)).findById(userId);
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return true when user exists and password matches")
    void verifyPasswordWhenUserExistsAndPasswordMatchesThenReturnsTrue() {
        // Given
        Long userId = 1L;
        String password = "password123";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, user.getPassword())).thenReturn(true);

        // When
        boolean result = userService.verifyPassword(userId, password);

        // Then
        verify(userRepository, times(1)).findById(userId);
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when user does not exist")
    void updatePasswordWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123";
        String newPassword = "newPassword123";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.updatePassword(userId, newPassword))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a RequestValidationException when new password is same as current password")
    void updatePasswordWhenNewPasswordIsSameAsCurrentPasswordThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123";
        String newPassword = "password123";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(newPassword, user.getPassword())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.updatePassword(userId, newPassword))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("New password must not be the same as the current password");

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update password when user exists and new password provided")
    void updatePasswordWhenUserExistsAndNewPasswordProvided() {
        // Given
        Long userId = 1L;
        String password = "password123";
        String newPassword = "newPassword123";
        String newEncodedPassword = "newEncodedPassword123";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn(newEncodedPassword);

        // When
        userService.updatePassword(userId, newPassword);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getPassword()).isEqualTo(newEncodedPassword);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when userId is invalid")
    void updateUserImageWhenUserIdIsInvalidThenThrowException() {
        // Given
        Long userId = 1L;
        MockMultipartFile imageFile = new MockMultipartFile("imageFile", "hello.jpg", "image/jpeg", new byte[]{});

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.updateUserImage(userId, imageFile))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(imageUtil, times(0)).getImageBytesFromMultipartFile(imageFile);
        verify(uploadService, times(0)).uploadImageResourceToCloudinary(anyLong(), any(byte[].class), any(UploadSignatureRequest.class));
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update user image when userId and imageFile are valid")
    void updateUserImageWhenUserIdAndImageFileAreValid() {
        // Given
        Long userId = 1L;
        MockMultipartFile imageFile = new MockMultipartFile("imageFile", "hello.jpg", "image/jpeg", new byte[]{});
        User user = new User();
        user.setId(userId);
        byte[] imageBytes = new byte[]{};
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, UploadType.AVATAR.name());
        Map<String, String> uploadedImageResult = Map.of("publicId", "publicId", "secureUrl", "secureUrl");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(imageUtil.getImageBytesFromMultipartFile(imageFile)).thenReturn(imageBytes);
        when(uploadService.uploadImageResourceToCloudinary(userId, imageBytes, signatureRequest)).thenReturn(uploadedImageResult);

        // When
        userService.updateUserImage(userId, imageFile);

        // Then
        verify(userRepository, times(1)).findById(userId);
        verify(imageUtil, times(1)).getImageBytesFromMultipartFile(imageFile);
        verify(uploadService, times(1)).uploadImageResourceToCloudinary(userId, new byte[]{}, signatureRequest);

        assertThat(user.getUserImage()).isEqualTo("secureUrl");
        assertThat(user.getUserImageUploadId()).isEqualTo("publicId");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when user does not exist")
    void removeUserImageWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.removeUserImage(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(uploadService, times(0)).deleteCloudinaryImageResourceByPublicId(anyString(), eq(true));
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should remove user image when user exists")
    void removeUserImageWhenUserExistsThenImageRemoved() {
        // Given
        Long userId = 1L;
        User user = new User(userId, "username", "email@test.com", "password", "name",
                null, null, null, Gender.MALE, "imageUploadId", "imageUrl");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        userService.removeUserImage(userId);

        // Then
        verify(userRepository, times(1)).findById(userId);
        verify(uploadService, times(1))
                .deleteCloudinaryImageResourceByPublicId(anyString(), eq(true));

        assertThat(user.getUserImage()).isEmpty();
        assertThat(user.getUserImageUploadId()).isEmpty();
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user ID does not exist")
    void updateUserWhenUserIdDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "newUsername", "newEmail@example.com",
                "newName", "newMobile", "newWebsite", "newBio",
                Gender.MALE);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.updateUser(userId, updateRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw an exception when the email is already taken")
    void updateUserWhenEmailIsAlreadyTakenThenThrowException() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "newUsername", "existingEmail@example.com",
                "newName", "newMobile", "newWebsite", "newBio",
                Gender.MALE);
        User user = new User(
                userId, "Username", "existingEmail@example.com", "Password",
                "Name", "Mobile", "Website", "Bio",
                Gender.MALE, "UserImageUploadId", "UserImage");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsUserByEmail(updateRequest.email())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.updateUser(userId, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This email is already taken");

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsUserByEmail(updateRequest.email());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw an exception when the username is already taken")
    void updateUserWhenUserHandleNameIsAlreadyTakenThenThrowException() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "existingUsername", "newEmail@example.com",
                "newName", "newMobile", "newWebsite", "newBio",
                Gender.MALE);
        User user = new User(
                userId, "existingUsername", "Email@example.com", "Password",
                "Name", "Mobile", "Website", "Bio",
                Gender.MALE, "UserImageUploadId", "UserImage");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsUserByUserHandleName(updateRequest.username())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.updateUser(userId, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This username is already taken");

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsUserByUserHandleName(updateRequest.username());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw an exception when no changes are found")
    void updateUserWhenNoChangesFoundThenThrowException() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "Username", "existingEmail@example.com",
                "Name", "Mobile", "Website", "Bio",
                Gender.MALE);
        User user = new User(
                userId, "Username", "existingEmail@example.com", "Password",
                "Name", "Mobile", "Website", "Bio",
                Gender.MALE, "UserImageUploadId", "UserImage");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsUserByEmail(updateRequest.email())).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> userService.updateUser(userId, updateRequest))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("No changes found");

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsUserByEmail(updateRequest.email());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update the user when the user ID exists and the email is not taken")
    void updateUserWhenUserIdExistsAndEmailIsNotTaken() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "newUsername",
                "newemail@example.com",
                "newName",
                "newMobile",
                "newWebsite",
                "newBio",
                Gender.MALE
        );
        User user = new User(
                userId,
                "Username",
                "email@example.com",
                "password",
                "Name",
                "Mobile",
                "Website",
                "Bio",
                Gender.MALE,
                "UserImageUploadId",
                "UserImage"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsUserByEmail(updateRequest.email())).thenReturn(false);

        // When
        userService.updateUser(userId, updateRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsUserByEmail(updateRequest.email());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getId()).isEqualTo(userId);
        assertThat(savedUser.getUserHandleName()).isEqualTo(updateRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(updateRequest.email());
        assertThat(savedUser.getName()).isEqualTo(updateRequest.name());
        assertThat(savedUser.getMobile()).isEqualTo(updateRequest.mobile());
        assertThat(savedUser.getWebsite()).isEqualTo(updateRequest.website());
        assertThat(savedUser.getBio()).isEqualTo(updateRequest.bio());
        assertThat(savedUser.getGender()).isEqualTo(updateRequest.gender());
    }

    @Test
    @DisplayName("Should update the user when the user ID exists and the username is not taken")
    void updateUserWhenUserIdExistsAndUserHandleNameIsNotTaken() {
        // Given
        Long userId = 1L;
        UserUpdateRequest updateRequest = new UserUpdateRequest(
                "newUsername",
                "newemail@example.com",
                "newName",
                "newMobile",
                "newWebsite",
                "newBio",
                Gender.MALE
        );
        User user = new User(
                userId,
                "Username",
                "email@example.com",
                "password",
                "Name",
                "Mobile",
                "Website",
                "Bio",
                Gender.MALE,
                "UserImageUploadId",
                "UserImage"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.existsUserByUserHandleName(updateRequest.username())).thenReturn(false);

        // When
        userService.updateUser(userId, updateRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsUserByUserHandleName(updateRequest.username());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getId()).isEqualTo(userId);
        assertThat(savedUser.getUserHandleName()).isEqualTo(updateRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(updateRequest.email());
        assertThat(savedUser.getName()).isEqualTo(updateRequest.name());
        assertThat(savedUser.getMobile()).isEqualTo(updateRequest.mobile());
        assertThat(savedUser.getWebsite()).isEqualTo(updateRequest.website());
        assertThat(savedUser.getBio()).isEqualTo(updateRequest.bio());
        assertThat(savedUser.getGender()).isEqualTo(updateRequest.gender());
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user does not exist")
    void deleteUserByIdWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.deleteUser(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(0)).deleteById(userId);
    }

    @Test
    @DisplayName("Should delete the user by ID when the user exists")
    void deleteUserByIdWhenUserExists() {
        // Given
        Long userId = 1L;
        User user = new User(
                userId, "john.doe", "john.doe@example.com", "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        userService.deleteUser(userId);

        // Then
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).deleteById(userId);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user ID is not found")
    void findUserByIdWhenUserIdNotFoundThenThrowException() {
        // Given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserById(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should return the user when the user ID is valid")
    void findUserByIdWhenUserIdIsValid() {
        // Given
        Long userId = 1L;
        User user = new User(
                userId, "john.doe", "john.doe@example.com", "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");
        UserDTO expectedUserDTO = new UserDTO(
                userId, "john.doe", "john.doe@example.com", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg", new LinkedHashSet<>(),
                new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        UserDTO actualUserDTO = userService.findUserById(userId);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the username does not exist")
    void findUserByUsernameWhenUsernameDoesNotExistThenThrowException() {
        // Given
        String username = "nonexistentuser";
        when(userRepository.findByUserHandleName(username)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByUsername(username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found with username: " + username);

        verify(userRepository, times(1)).findByUserHandleName(username);
    }

    @Test
    @DisplayName("Should return the user when the username exists")
    void findUserByUsernameWhenUsernameExists() {
        // Given
        String username = "john_doe";
        User user = new User(username, "john.doe@example.com",
                "password", "John Doe", Gender.MALE);
        user.setId(1L);
        UserDTO expectedUserDTO = new UserDTO(
                1L, username, "john.doe@example.com", "John Doe",
                null, null, null,
                Gender.MALE, null, null, new LinkedHashSet<>(),
                new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), new ArrayList<String>(List.of("ROLE_USER")));

        when(userRepository.findByUserHandleName(username)).thenReturn(Optional.of(user));

        // When
        UserDTO actualUserDTO = userService.findUserByUsername(username);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findByUserHandleName(username);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when the user to be followed is not found")
    void followUserWhenFollowUserNotFoundThenThrowException() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;
        User reqUser = new User(
                reqUserId, "john.doe", "john.doe@example.com",
                "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(followUserId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.followUser(reqUserId, followUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(followUserId));

        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(1)).findById(followUserId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when the requested user is not found")
    void followUserWhenReqUserNotFoundThenThrowException() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;

        when(userRepository.findById(reqUserId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.followUser(reqUserId, followUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(reqUserId));

        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(0)).findById(followUserId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should return 'Followed' when the user successfully follows another user")
    void followUserWhenSuccessful() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;
        User reqUser = new User(
                reqUserId, "john.doe", "john.doe@example.com",
                "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");
        User followUser = new User(
                followUserId, "jane.doe", "jane.doe@example.com",
                "password", "Jane Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.FEMALE, "image123", "image.jpg");

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(followUserId)).thenReturn(Optional.of(followUser));

        // When
        String actual = userService.followUser(reqUserId, followUserId);

        // Then
        assertThat(actual).isEqualTo("You are following " + followUser.getUserHandleName());
        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(1)).findById(followUserId);
        verify(userRepository, times(1)).save(reqUser);
        verify(userRepository, times(1)).save(followUser);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user to be unfollowed does not exist")
    void unfollowUserWhenUserToBeUnfollowedDoesNotExistThenThrowException() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;
        User reqUser = new User(
                reqUserId, "john.doe", "john.doe@example.com",
                "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(followUserId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.followUser(reqUserId, followUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(followUserId));

        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(1)).findById(followUserId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the requesting user does not exist")
    void unfollowUserWhenRequestingUserDoesNotExistThenThrowException() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;

        when(userRepository.findById(reqUserId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.followUser(reqUserId, followUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(reqUserId));

        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(0)).findById(followUserId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should unfollow the user successfully when both users exist")
    void unfollowUserWhenBothUsersExist() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;
        User reqUser = new User(
                reqUserId, "john.doe", "john.doe@example.com",
                "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg");
        User followUser = new User(
                followUserId, "jane.doe", "jane.doe@example.com",
                "password", "Jane Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.FEMALE, "image123", "image.jpg");

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(followUserId)).thenReturn(Optional.of(followUser));

        // When
        String actual = userService.unfollowUser(reqUserId, followUserId);

        // Then
        assertThat(actual).isEqualTo("You have unfollowed " + followUser.getUserHandleName());
        verify(userRepository, times(1)).findById(reqUserId);
        verify(userRepository, times(1)).findById(followUserId);
        verify(userRepository, times(1)).save(reqUser);
        verify(userRepository, times(1)).save(followUser);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when given an empty list of user IDs")
    void findUserByIdsWhenGivenEmptyListThenThrowException() {
        // Given
        List<Long> userIds = new ArrayList<>();

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByIds(userIds))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when given a list of invalid user IDs")
    void findUserByIdsWhenGivenInvalidUserIdsThenThrowException() {
        // Given
        List<Long> userIds = List.of(1L, 2L, 3L);
        when(userRepository.findAllUsersByUserIds(userIds)).thenReturn(new ArrayList<>());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByIds(userIds))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should return a list of UserDTOs when given a list of valid user IDs")
    void findUserByIdsWhenGivenValidUserIds() {
        // Given
        List<Long> userIds = List.of(1L, 2L, 3L);
        List<User> users = List.of(
                new User(1L, "user1", "user1@example.com", "password1", "User 1", null, null, null, Gender.MALE, null, null),
                new User(2L, "user2", "user2@example.com", "password2", "User 2", null, null, null,
                        Gender.FEMALE, null, null),
                new User(3L, "user3", "user3@example.com", "password3", "User 3", null, null, null,
                        Gender.OTHER, null, null)
        );
        List<UserDTO> expectedUsers = List.of(
                new UserDTO(1L, "user1", "user1@example.com", "User 1", null, null, null,
                        Gender.MALE, null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER")),
                new UserDTO(2L, "user2", "user2@example.com", "User 2", null, null, null,
                        Gender.FEMALE, null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER")),
                new UserDTO(3L, "user3", "user3@example.com", "User 3", null, null, null,
                        Gender.OTHER, null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER"))
        );

        when(userRepository.findAllUsersByUserIds(userIds)).thenReturn(users);

        // When
        List<UserDTO> actualUsers = userService.findUserByIds(userIds);

        // Then
        assertThat(actualUsers).isEqualTo(expectedUsers);
        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the search query is null or empty")
    void searchUserWhenSearchQueryNullThenThrowException() {
        // Given
        String searchQuery = null;

        // When
        // Then
        assertThatThrownBy(() -> userService.searchUser(searchQuery))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findByQuery(searchQuery);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the search query is empty")
    void searchUserWhenSearchQueryEmptyThenThrowException() {
        // Given
        String searchQuery = "";

        // When
        // Then
        assertThatThrownBy(() -> userService.searchUser(searchQuery))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findByQuery(searchQuery);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when no users match the search query")
    void searchUserWhenNoMatchingUsersFoundThenThrowException() {
        // Given
        String searchQuery = "John";
        List<User> users = new ArrayList<>();
        when(userRepository.findByQuery(searchQuery)).thenReturn(users);

        // When
        // Then
        assertThatThrownBy(() -> userService.searchUser(searchQuery))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(userRepository, times(1)).findByQuery(searchQuery);
    }

    @Test
    @DisplayName("Should return a list of users matching the search query")
    void searchUserWhenMatchingUsersFound() {
        // Given
        String searchQuery = "John";
        List<User> users = List.of(
                new User(1L, "john.doe", "john.doe@example.com", "password", "John Doe", null, null, null,
                        Gender.MALE, null, null),
                new User(2L, "john.smith", "john.smith@example.com", "password", "John Smith", null, null, null,
                        Gender.MALE, null, null)
        );
        List<UserDTO> expectedUsers = List.of(
                new UserDTO(1L, "john.doe", "john.doe@example.com", "John Doe", null, null, null,
                        Gender.MALE, null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER")),
                new UserDTO(2L, "john.smith", "john.smith@example.com", "John Smith", null, null, null,
                        Gender.MALE, null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER"))
        );

        when(userRepository.findByQuery(searchQuery)).thenReturn(users);

        // When
        List<UserDTO> actualUsers = userService.searchUser(searchQuery);

        // Then
        assertThat(actualUsers.size()).isEqualTo(2);

        assertThat(actualUsers.get(0).getUsername()).isEqualTo(expectedUsers.get(0).getUsername());
        assertThat(actualUsers.get(0).getEmail()).isEqualTo(expectedUsers.get(0).getEmail());
        assertThat(actualUsers.get(0).getName()).isEqualTo(expectedUsers.get(0).getName());
        assertThat(actualUsers.get(0).getGender()).isEqualTo(expectedUsers.get(0).getGender());

        assertThat(actualUsers.get(1).getUsername()).isEqualTo(expectedUsers.get(1).getUsername());
        assertThat(actualUsers.get(1).getEmail()).isEqualTo(expectedUsers.get(1).getEmail());
        assertThat(actualUsers.get(1).getName()).isEqualTo(expectedUsers.get(1).getName());
        assertThat(actualUsers.get(1).getGender()).isEqualTo(expectedUsers.get(1).getGender());
    }
}