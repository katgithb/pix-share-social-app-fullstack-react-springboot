package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.CommentRepository;
import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.TokenValidationException;
import com.pixshare.pixshareapi.post.PostRepository;
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
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import sendinblue.ApiException;
import sibApi.TransactionalEmailsApi;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ExtendWith(MockitoExtension.class)
@Import(ValidationUtilTestConfig.class)
class UserServiceTest {

    private final UserViewMapper userViewMapper = new UserViewMapper();
    private final PostViewMapper postViewMapper = new PostViewMapper(userViewMapper);
    private final UserDTOMapper userDTOMapper = new UserDTOMapper(userViewMapper, postViewMapper);
    private final UserSummaryDTOMapper userSummaryDTOMapper = new UserSummaryDTOMapper(userViewMapper);
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
    private RoleService roleService;
    @Mock
    private StoryService storyService;
    @Mock
    private UploadService uploadService;
    @Mock
    private PasswordResetAttemptService passwordResetAttemptService;
    @Mock
    private BrevoMailSender brevoMailSender;
    @Mock
    private ImageUtil imageUtil;
    @Mock
    private PasswordEncoder passwordEncoder;
    @SpyBean
    private ValidationUtil validationUtil;
    @Mock
    private UrlValidator urlValidator;
    @Mock
    private HMACTokenUtil hmacTokenUtil;

    private Role userRole;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, postRepository, commentRepository, storyRepository,
                roleService, storyService, uploadService, passwordResetAttemptService, brevoMailSender,
                imageUtil, passwordEncoder, validationUtil, urlValidator, hmacTokenUtil,
                userDTOMapper, userSummaryDTOMapper);

        Short userRoleId = 1;
        userRole = Role.of(RoleName.USER);
        userRole.setId(userRoleId);
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
                "password123#", Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This email is already taken");

        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(roleService, times(0)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(0)).performValidation(any(User.class), anyList());
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
                "password123#", Gender.MALE);

        when(userRepository.existsUserByEmail(email)).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(1)).performValidation(any(User.class), anyList());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
        assertThat(savedUser.getRole()).isEqualTo(userRole);
    }

    @Test
    @DisplayName("Should throw a DuplicateResourceException when the username is already taken")
    void registerUserWhenUserHandleNameIsAlreadyTakenThenThrowException() {
        // Given
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", "john.doe@example.com", "John Doe",
                "password123#", Gender.MALE);

        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("This username is already taken");

        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(0)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(0)).performValidation(any(User.class), anyList());
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
                "password123#", Gender.MALE);

        when(userRepository.existsUserByUserHandleName(userHandleName)).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(1)).performValidation(any(User.class), anyList());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
        assertThat(savedUser.getRole()).isEqualTo(userRole);
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when password is invalid")
    void registerUserWhenPasswordIsInvalidThenThrowException() {
        // Given
        String invalidPassword = "abc";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", "john.doe@example.com", "John Doe",
                invalidPassword, Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(false);
        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(ConstraintViolationException.class);

        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(0)).performValidation(any(User.class), anyList());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should register a new user when password is valid")
    void registerUserWhenPasswordIsValid() {
        // Given
        String password = "password123#";
        String passwordHash = "MThubHBpN3d4b2RsN2RkYzV3bW1mdnl0bm5pOGNpY2o2ZnQxZTN4ZmY2Nmk4ZW05bjJ1Y3o2ZnhleXBmOW84MzF3ZWQ4MDJsbmltNTl4amk0ZGhhNWZiOWJiN3BwemdubWM0dWJqamt4NDJuaW4wMWxzazNlOTFzY3diMjlocDM=";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", "john.doe@example.com", "John Doe",
                password, Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(false);
        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(1)).performValidation(any(User.class), anyList());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
        assertThat(savedUser.getRole()).isEqualTo(userRole);
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when email is invalid")
    void registerUserWhenEmailIsInvalidThenThrowException() {
        // Given
        String email = "john-doe.com";
        String passwordHash = "MThubHBpN3d4b2RsN2RkYzV3bW1mdnl0bm5pOGNpY2o2ZnQxZTN4ZmY2Nmk4ZW05bjJ1Y3o2ZnhleXBmOW84MzF3ZWQ4MDJsbmltNTl4amk0ZGhhNWZiOWJiN3BwemdubWM0dWJqamt4NDJuaW4wMWxzazNlOTFzY3diMjlocDM=";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", email, "John Doe",
                "password123#", Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(false);
        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        // Then
        assertThatThrownBy(() -> userService.registerUser(registrationRequest))
                .isInstanceOf(ConstraintViolationException.class);

        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(1)).performValidation(any(User.class), anyList());
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should register a new user when email is valid")
    void registerUserWhenEmailIsValid() {
        // Given
        String email = "john.doe@example.com";
        String passwordHash = "MThubHBpN3d4b2RsN2RkYzV3bW1mdnl0bm5pOGNpY2o2ZnQxZTN4ZmY2Nmk4ZW05bjJ1Y3o2ZnhleXBmOW84MzF3ZWQ4MDJsbmltNTl4amk0ZGhhNWZiOWJiN3BwemdubWM0dWJqamt4NDJuaW4wMWxzazNlOTFzY3diMjlocDM=";
        UserRegistrationRequest registrationRequest = new UserRegistrationRequest(
                "john.doe", email, "John Doe",
                "password123#", Gender.MALE);

        when(userRepository.existsUserByEmail(registrationRequest.email())).thenReturn(false);
        when(userRepository.existsUserByUserHandleName(registrationRequest.username())).thenReturn(false);
        when(roleService.getRoleByName(RoleName.USER.name())).thenReturn(userRole);
        when(passwordEncoder.encode(registrationRequest.password())).thenReturn(passwordHash);

        // When
        userService.registerUser(registrationRequest);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).existsUserByEmail(registrationRequest.email());
        verify(userRepository, times(1)).existsUserByUserHandleName(registrationRequest.username());
        verify(roleService, times(1)).getRoleByName(RoleName.USER.name());
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", registrationRequest.password());
        verify(validationUtil, times(1)).performValidation(any(User.class), anyList());
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getUserHandleName()).isEqualTo(registrationRequest.username());
        assertThat(savedUser.getEmail()).isEqualTo(registrationRequest.email());
        assertThat(savedUser.getPassword()).isEqualTo(passwordHash);
        assertThat(savedUser.getName()).isEqualTo(registrationRequest.name());
        assertThat(savedUser.getGender()).isEqualTo(registrationRequest.gender());
        assertThat(savedUser.getRole()).isEqualTo(userRole);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when user does not exist")
    void verifyPasswordWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123#";

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
        String password = "password123#";
        String wrongPassword = "wrongPassword123#";
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
        String password = "password123#";
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
        String newPassword = "newPassword123#";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.updatePassword(userId, newPassword))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a RequestValidationException when new password is same as current password")
    void updatePasswordWhenNewPasswordIsSameAsCurrentPasswordThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123#";
        String newPassword = "password123#";
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
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when new password is invalid")
    void updatePasswordWhenNewPasswordIsInvalidThenThrowException() {
        // Given
        Long userId = 1L;
        String password = "password123#";
        String invalidNewPassword = "abc";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(invalidNewPassword, user.getPassword())).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> userService.updatePassword(userId, invalidNewPassword))
                .isInstanceOf(ConstraintViolationException.class);

        verify(userRepository, times(1)).findById(userId);
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", invalidNewPassword);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update password when user exists and new password is valid")
    void updatePasswordWhenUserExistsAndNewPasswordIsValid() {
        // Given
        Long userId = 1L;
        String password = "password123#";
        String newPassword = "newPassword123#";
        String newEncodedPassword = "newEncodedPassword123#";
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(newPassword, user.getPassword())).thenReturn(false);
        when(passwordEncoder.encode(newPassword)).thenReturn(newEncodedPassword);

        // When
        userService.updatePassword(userId, newPassword);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).findById(userId);
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(1)).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getPassword()).isEqualTo(newEncodedPassword);
    }

    @Test
    @DisplayName("Should throw a RequestValidationException when max password reset attempts reached")
    void initiatePasswordResetWhenMaxPasswordResetAttemptsReachedThenThrowException() {
        // Given
        String email = "test@example.com";

        when(passwordResetAttemptService.isPasswordResetAttemptAllowed(eq(email), anyLong())).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> userService.initiatePasswordReset(email))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("You have reached the maximum allowed attempts to reset your password.");

        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptAllowed(eq(email), anyLong());
        verify(passwordResetAttemptService, times(0)).savePasswordResetAttempt(eq(email), anyLong());
        verify(userRepository, times(0)).findByEmail(email);
        verify(hmacTokenUtil, times(0)).generateHMACToken(eq(email), any(Date.class));
    }

    @Test
    @DisplayName("Should not send password reset email when user does not exist with given email")
    void initiatePasswordResetWhenUserDoesNotExistThenDoNotSendPasswordResetEmail() throws ApiException {
        // Given
        String email = "invalid_email@example.com";

        when(passwordResetAttemptService.isPasswordResetAttemptAllowed(eq(email), anyLong())).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        userService.initiatePasswordReset(email);

        // Then
        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptAllowed(eq(email), anyLong());
        verify(passwordResetAttemptService, times(1)).savePasswordResetAttempt(eq(email), anyLong());
        verify(userRepository, times(1)).findByEmail(email);
        verify(hmacTokenUtil, times(0)).generateHMACToken(eq(email), any(Date.class));

        verify(brevoMailSender, times(0)).getTransacEmailsApiInstance();
        verify(brevoMailSender, times(0)).sendTransactionalEmail(any(TransactionalEmailsApi.class), anyString(), anyString(), anyString(), any(Properties.class));
    }

    @Test
    @DisplayName("Should initiate password reset when user exists with given email and password reset attempts are allowed")
    void initiatePasswordResetWhenUserExistsAndPasswordResetAttemptsAreAllowed() throws ApiException {
        // Given
        Long userId = 1L;
        String email = "john.doe@example.com";
        String generatedToken = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        TransactionalEmailsApi apiInstance = new TransactionalEmailsApi();
        User user = new User(userId, "john_doe", email, "password1234!", "John Doe",
                null, null, null,
                Gender.MALE, null, null, userRole);

        when(passwordResetAttemptService.isPasswordResetAttemptAllowed(eq(email), anyLong())).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(hmacTokenUtil.generateHMACToken(eq(email), any(Date.class))).thenReturn(generatedToken);
        when(urlValidator.isValidUrl(anyString())).thenReturn(true);
        when(brevoMailSender.getTransacEmailsApiInstance()).thenReturn(apiInstance);

        // When
        userService.initiatePasswordReset(email);

        // Then
        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptAllowed(eq(email), anyLong());
        verify(passwordResetAttemptService, times(1)).savePasswordResetAttempt(eq(email), anyLong());
        verify(userRepository, times(1)).findByEmail(email);
        verify(hmacTokenUtil, times(1)).generateHMACToken(eq(email), any(Date.class));
        verify(urlValidator, times(1)).isValidUrl(anyString());

        verify(brevoMailSender, times(1)).getTransacEmailsApiInstance();
        verify(brevoMailSender, times(1)).sendTransactionalEmail(any(TransactionalEmailsApi.class), eq(email), eq(user.getName()), anyString(), any(Properties.class));
    }

    @Test
    @DisplayName("Should throw a TokenValidationException when token has already been used once")
    void validatePasswordResetTokenWhenTokenHasAlreadyBeenUsedOnceThenThrowException() {
        // Given
        String token = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        String metadata = "metadata";
        String identifier = "test@example.com";
        long timestampMillis = System.currentTimeMillis();

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(identifier);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(passwordResetAttemptService.isPasswordResetAttemptSuccessful(identifier, timestampMillis)).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> userService.validatePasswordResetToken(token))
                .isInstanceOf(TokenValidationException.class)
                .hasMessage("Password reset token is only valid to be used once. This token has already been used, so you must request a new one.");

        verify(hmacTokenUtil, times(1)).extractMetadataFromToken(token);
        verify(hmacTokenUtil, times(1)).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, times(1)).extractTimestampMillisFromToken(token);
        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptSuccessful(identifier, timestampMillis);//
        verify(hmacTokenUtil, times(0)).validateToken(identifier, token);
    }

    @Test
    @DisplayName("Should return false when token has not been used before and is invalid")
    void validatePasswordResetTokenWhenTokenHasNotBeenUsedBeforeAndIsInvalidThenReturnsFalse() {
        // Given
        String token = "invalidToken";
        String metadata = "metadata";
        String identifier = "test@example.com";
        long timestampMillis = System.currentTimeMillis();

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(identifier);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(passwordResetAttemptService.isPasswordResetAttemptSuccessful(identifier, timestampMillis)).thenReturn(false);
        when(hmacTokenUtil.validateToken(identifier, token)).thenReturn(false);

        // When
        boolean result = userService.validatePasswordResetToken(token);

        // Then
        verify(hmacTokenUtil, times(1)).extractMetadataFromToken(token);
        verify(hmacTokenUtil, times(1)).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, times(1)).extractTimestampMillisFromToken(token);
        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptSuccessful(identifier, timestampMillis);//
        verify(hmacTokenUtil, times(1)).validateToken(identifier, token);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return true when token has not been used before and is valid")
    void validatePasswordResetTokenWhenTokenHasNotBeenUsedBeforeAndIsValidThenReturnsTrue() {
        // Given
        String token = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        String metadata = "metadata";
        String identifier = "test@example.com";
        long timestampMillis = System.currentTimeMillis();

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(identifier);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(passwordResetAttemptService.isPasswordResetAttemptSuccessful(identifier, timestampMillis)).thenReturn(false);
        when(hmacTokenUtil.validateToken(identifier, token)).thenReturn(true);

        // When
        boolean result = userService.validatePasswordResetToken(token);

        // Then
        verify(hmacTokenUtil, times(1)).extractMetadataFromToken(token);
        verify(hmacTokenUtil, times(1)).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, times(1)).extractTimestampMillisFromToken(token);
        verify(passwordResetAttemptService, times(1)).isPasswordResetAttemptSuccessful(identifier, timestampMillis);//
        verify(hmacTokenUtil, times(1)).validateToken(identifier, token);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should throw a TokenValidationException when token is invalid")
    void resetPasswordWhenTokenIsInvalidThenThrowException() {
        // Given
        String token = "invalidToken";
        String metadata = "metadata";
        String email = "user1@example.com";
        long timestampMillis = System.currentTimeMillis();
        String newPassword = "newValidPassword1234!";

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(email);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(userService.validatePasswordResetToken(token)).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> userService.resetPassword(token, newPassword))
                .isInstanceOf(TokenValidationException.class)
                .hasMessage("Invalid password reset token");

        verify(hmacTokenUtil, atLeastOnce()).extractMetadataFromToken(token);
        verify(hmacTokenUtil, atLeastOnce()).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, atLeastOnce()).extractTimestampMillisFromToken(token);

        verify(userRepository, times(0)).findByEmail(email);
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(0)).save(any(User.class));
        verify(passwordResetAttemptService, times(0)).updatePasswordResetAttemptSuccess(email, timestampMillis, true);
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when new password is invalid")
    void resetPasswordWhenNewPasswordIsInvalidThenThrowException() {
        // Given
        Long userId = 1L;
        String token = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        String metadata = "metadata";
        String email = "john.doe@example.com";
        long timestampMillis = System.currentTimeMillis();
        String newPassword = "newInvalidPassword";
        User user = new User(userId, "john_doe", email, "password1234!", "John Doe",
                null, null, null,
                Gender.MALE, null, null, userRole);

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(email);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(userService.validatePasswordResetToken(token)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        // Then
        assertThatThrownBy(() -> userService.resetPassword(token, newPassword))
                .isInstanceOf(ConstraintViolationException.class);

        verify(hmacTokenUtil, atLeastOnce()).extractMetadataFromToken(token);
        verify(hmacTokenUtil, atLeastOnce()).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, atLeastOnce()).extractTimestampMillisFromToken(token);

        verify(userRepository, times(1)).findByEmail(email);
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(0)).save(any(User.class));
        verify(passwordResetAttemptService, times(0)).updatePasswordResetAttemptSuccess(email, timestampMillis, true);
    }

    @Test
    @DisplayName("Should not reset password when user does not exist with given email")
    void resetPasswordWhenUserDoesNotExistThenDoNotResetPassword() {
        // Given
        String token = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        String metadata = "metadata";
        String email = "user1@example.com";
        long timestampMillis = System.currentTimeMillis();
        String newPassword = "newValidPassword1234!";

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(email);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(userService.validatePasswordResetToken(token)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        userService.resetPassword(token, newPassword);

        // Then
        verify(hmacTokenUtil, atLeastOnce()).extractMetadataFromToken(token);
        verify(hmacTokenUtil, atLeastOnce()).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, atLeastOnce()).extractTimestampMillisFromToken(token);

        verify(userRepository, times(1)).findByEmail(email);
        verify(validationUtil, times(0)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(0)).save(any(User.class));
        verify(passwordResetAttemptService, times(0)).updatePasswordResetAttemptSuccess(email, timestampMillis, true);
    }

    @Test
    @DisplayName("Should reset password when user exists with given email and token and new password are valid")
    void resetPasswordWhenUserExistsAndTokenAndNewPasswordAreValid() {
        // Given
        Long userId = 1L;
        String token = "Z9wMSQbpr7UK8W02GTOdyfjLZW-a8gVZGW8CnbfDMF4";
        String metadata = "metadata";
        String email = "john.doe@example.com";
        long timestampMillis = System.currentTimeMillis();
        String newPassword = "newValidPassword1234!";
        String newEncodedPassword = "newEncodedPassword1234!";
        User user = new User(userId, "john_doe", email, "password1234!", "John Doe",
                null, null, null,
                Gender.MALE, null, null, userRole);

        when(hmacTokenUtil.extractMetadataFromToken(token)).thenReturn(metadata);
        when(hmacTokenUtil.extractIdentifierFromTokenMetadata(metadata)).thenReturn(email);
        when(hmacTokenUtil.extractTimestampMillisFromToken(token)).thenReturn(timestampMillis);
        when(userService.validatePasswordResetToken(token)).thenReturn(true);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn(newEncodedPassword);

        // When
        userService.resetPassword(token, newPassword);

        // Then
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(hmacTokenUtil, atLeastOnce()).extractMetadataFromToken(token);
        verify(hmacTokenUtil, atLeastOnce()).extractIdentifierFromTokenMetadata(metadata);
        verify(hmacTokenUtil, atLeastOnce()).extractTimestampMillisFromToken(token);

        verify(userRepository, times(1)).findByEmail(email);
        verify(validationUtil, times(1)).performValidationOnField(User.class, "password", newPassword);
        verify(userRepository, times(1)).save(userCaptor.capture());
        verify(passwordResetAttemptService, times(1)).updatePasswordResetAttemptSuccess(email, timestampMillis, true);

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
                null, null, null, Gender.MALE, "imageUploadId", "imageUrl", userRole);

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
                Gender.MALE, "UserImageUploadId", "UserImage", userRole);

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
                Gender.MALE, "UserImageUploadId", "UserImage", userRole);

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
                Gender.MALE, "UserImageUploadId", "UserImage", userRole);

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
                "new_username",
                "newemail@example.com",
                "newName",
                "newMobile",
                "new-website.com",
                "newBio",
                Gender.MALE
        );
        User user = new User(
                userId,
                "username",
                "email@example.com",
                "password",
                "Name",
                "Mobile",
                "website.com",
                "Bio",
                Gender.MALE,
                "UserImageUploadId",
                "UserImage",
                userRole
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
                "new_username",
                "newemail@example.com",
                "newName",
                "newMobile",
                "new-website.com",
                "newBio",
                Gender.MALE
        );
        User user = new User(
                userId,
                "username",
                "email@example.com",
                "password",
                "Name",
                "Mobile",
                "website.com",
                "Bio",
                Gender.MALE,
                "UserImageUploadId",
                "UserImage",
                userRole
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
                Gender.MALE, "image123", "image.jpg", userRole);

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
        Long authUserId = 2L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserById(authUserId, userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should return the user when the user ID is valid")
    void findUserByIdWhenUserIdIsValid() {
        // Given
        Long userId = 1L;
        Long authUserId = 2L;
        User user = new User(
                userId, "john.doe", "john.doe@example.com", "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg", userRole);
        UserSummaryDTO expectedUserDTO = new UserSummaryDTO(
                userId, "john.doe", "John Doe",
                "www.example.com", "Bio",
                "image123", "image.jpg", new LinkedHashSet<>(),
                new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER"));

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        UserSummaryDTO actualUserDTO = userService.findUserById(authUserId, userId);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the email does not exist")
    void findUserByEmailWhenEmailDoesNotExistThenThrowException() {
        // Given
        Long authUserId = 2L;
        String email = "nonexistentuser@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByEmail(authUserId, email))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found with email: " + email);

        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("Should return the user when the email exists")
    void findUserByEmailWhenEmailExists() {
        // Given
        Long authUserId = 2L;
        String email = "john.doe@example.com";
        User user = new User("john_doe", email,
                "password", "John Doe", Gender.MALE, userRole);
        user.setId(1L);
        UserSummaryDTO expectedUserDTO = new UserSummaryDTO(
                1L, "john_doe", "John Doe",
                null, null,
                null, null, new LinkedHashSet<>(),
                new LinkedHashSet<>(), false, new ArrayList<>(), new ArrayList<String>(List.of("ROLE_USER")));

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        UserSummaryDTO actualUserDTO = userService.findUserByEmail(authUserId, email);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the username does not exist")
    void findUserByUsernameWhenUsernameDoesNotExistThenThrowException() {
        // Given
        Long authUserId = 2L;
        String username = "nonexistentuser";
        when(userRepository.findByUserHandleName(username)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByUsername(authUserId, username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found with username: " + username);

        verify(userRepository, times(1)).findByUserHandleName(username);
    }

    @Test
    @DisplayName("Should return the user when the username exists")
    void findUserByUsernameWhenUsernameExists() {
        // Given
        Long authUserId = 2L;
        String username = "john_doe";
        User user = new User(username, "john.doe@example.com",
                "password", "John Doe", Gender.MALE, userRole);
        user.setId(1L);
        UserSummaryDTO expectedUserDTO = new UserSummaryDTO(
                1L, username, "John Doe",
                null, null,
                null, null, new LinkedHashSet<>(),
                new LinkedHashSet<>(), false, new ArrayList<>(), new ArrayList<String>(List.of("ROLE_USER")));

        when(userRepository.findByUserHandleName(username)).thenReturn(Optional.of(user));

        // When
        UserSummaryDTO actualUserDTO = userService.findUserByUsername(authUserId, username);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findByUserHandleName(username);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user ID is not found")
    void findUserProfileWhenUserIdNotFoundThenThrowException() {
        // Given
        Long authUserId = 2L;
        when(userRepository.findById(authUserId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserProfile(authUserId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(authUserId));

        verify(userRepository, times(1)).findById(authUserId);
    }

    @Test
    @DisplayName("Should return the user when the user ID is valid")
    void findUserProfileWhenUserIdIsValid() {
        // Given
        Long authUserId = 2L;
        User user = new User(
                authUserId, "john.doe", "john.doe@example.com", "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg", userRole);
        UserDTO expectedUserDTO = new UserDTO(
                authUserId, "john.doe", "john.doe@example.com", "John Doe", "1234567890",
                "www.example.com", "Bio", Gender.MALE,
                "image123", "image.jpg", new LinkedHashSet<>(),
                new LinkedHashSet<>(), false, new ArrayList<>(), new LinkedHashSet<>(), List.of("ROLE_USER"));

        when(userRepository.findById(authUserId)).thenReturn(Optional.of(user));

        // When
        UserDTO actualUserDTO = userService.findUserProfile(authUserId);

        // Then
        assertThat(actualUserDTO).isEqualTo(expectedUserDTO);
        verify(userRepository, times(1)).findById(authUserId);
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
                Gender.MALE, "image123", "image.jpg", userRole);

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
    @DisplayName("Should throw a RequestValidationException when user attempts to follow self")
    void followUserWhenSelfFollowAttemptedThenThrowException() {
        // Given
        Long reqUserId = 1L;
        User reqUser = new User();
        reqUser.setId(reqUserId);
        User followUser = new User();
        followUser.setId(reqUserId);

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(followUser));

        // When
        // Then
        assertThatThrownBy(() -> userService.followUser(reqUserId, reqUserId))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Invalid Request: You cannot follow your own profile.");

        verify(userRepository, times(2)).findById(reqUserId);
        verify(userRepository, times(0)).save(any(User.class));
    }

    @Test
    @DisplayName("Should follow the user successfully when both users exist")
    void followUserWhenBothUsersExist() {
        // Given
        Long reqUserId = 1L;
        Long followUserId = 2L;
        User reqUser = new User(
                reqUserId, "john.doe", "john.doe@example.com",
                "password", "John Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.MALE, "image123", "image.jpg", userRole);
        User followUser = new User(
                followUserId, "jane.doe", "jane.doe@example.com",
                "password", "Jane Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.FEMALE, "image123", "image.jpg", userRole);

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
                Gender.MALE, "image123", "image.jpg", userRole);

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
    @DisplayName("Should throw a RequestValidationException when user attempts to unfollow self")
    void unfollowUserWhenSelfUnfollowAttemptedThenThrowException() {
        // Given
        Long reqUserId = 1L;
        User reqUser = new User();
        reqUser.setId(reqUserId);
        User followUser = new User();
        followUser.setId(reqUserId);

        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(reqUser));
        when(userRepository.findById(reqUserId)).thenReturn(Optional.of(followUser));

        // When
        // Then
        assertThatThrownBy(() -> userService.unfollowUser(reqUserId, reqUserId))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Invalid Request: You cannot unfollow your own profile.");

        verify(userRepository, times(2)).findById(reqUserId);
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
                Gender.MALE, "image123", "image.jpg", userRole);
        User followUser = new User(
                followUserId, "jane.doe", "jane.doe@example.com",
                "password", "Jane Doe",
                "1234567890", "www.example.com", "Bio",
                Gender.FEMALE, "image123", "image.jpg", userRole);

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
        Long authUserId = 2L;
        List<Long> userIds = new ArrayList<>();

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByIds(authUserId, userIds))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("No users found with the provided ID(s)");

        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when given a list of invalid user IDs")
    void findUserByIdsWhenGivenInvalidUserIdsThenThrowException() {
        // Given
        Long authUserId = 5L;
        List<Long> userIds = List.of(1L, 2L, 3L);
        when(userRepository.findAllUsersByUserIds(userIds)).thenReturn(new ArrayList<>());

        // When
        // Then
        assertThatThrownBy(() -> userService.findUserByIds(authUserId, userIds))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("No users found with the provided ID(s)");

        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should return a list of UserDTOs when given a list of valid user IDs")
    void findUserByIdsWhenGivenValidUserIds() {
        // Given
        Long authUserId = 5L;
        List<Long> userIds = List.of(1L, 2L, 3L);
        List<User> users = List.of(
                new User(1L, "user1", "user1@example.com", "password1", "User 1", null, null, null, Gender.MALE, null, null, userRole),
                new User(2L, "user2", "user2@example.com", "password2", "User 2", null, null, null,
                        Gender.FEMALE, null, null, userRole),
                new User(3L, "user3", "user3@example.com", "password3", "User 3", null, null, null,
                        Gender.OTHER, null, null, userRole)
        );
        List<UserSummaryDTO> expectedUsers = List.of(
                new UserSummaryDTO(1L, "user1", "User 1", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(2L, "user2", "User 2", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(3L, "user3", "User 3", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER"))
        );

        when(userRepository.findAllUsersByUserIds(userIds)).thenReturn(users);

        // When
        List<UserSummaryDTO> actualUsers = userService.findUserByIds(authUserId, userIds);

        // Then
        assertThat(actualUsers).isEqualTo(expectedUsers);
        verify(userRepository, times(1)).findAllUsersByUserIds(userIds);
    }

    @Test
    @DisplayName("Should return an empty list when no users match the search query")
    void searchUserWhenMatchingUsersNotFound() {
        // Given
        Long authUserId = 2L;
        String searchQuery = "NonExistentUser";
        PageRequestDTO pageRequest = new PageRequestDTO();

        Page<User> usersPage = new PageImpl<>(new ArrayList<>(), pageRequest.toPageable(), 0);

        when(userRepository.findByQuery(authUserId, searchQuery.toLowerCase(), pageRequest.toPageable())).thenReturn(usersPage);

        // When
        PagedResponse<UserSummaryDTO> actualUsersPage = userService.searchUser(authUserId, searchQuery, pageRequest);

        // Then
        assertThat(actualUsersPage.content().size()).isEqualTo(0);

        verify(userRepository, times(1)).findByQuery(authUserId, searchQuery.toLowerCase(), pageRequest.toPageable());
    }

    @Test
    @DisplayName("Should return a list of users matching the search query")
    void searchUserWhenMatchingUsersFound() {
        // Given
        Long authUserId = 2L;
        String searchQuery = "John";
        PageRequestDTO pageRequest = new PageRequestDTO();

        List<User> users = List.of(
                new User(1L, "john.doe", "john.doe@example.com", "password", "John Doe", null, null, null,
                        Gender.MALE, null, null, userRole),
                new User(2L, "john.smith", "john.smith@example.com", "password", "John Smith", null, null, null,
                        Gender.MALE, null, null, userRole)
        );
        List<UserSummaryDTO> expectedUsers = List.of(
                new UserSummaryDTO(1L, "john.doe", "John Doe", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(2L, "john.smith", "John Smith", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER"))
        );
        Page<User> usersPage = new PageImpl<>(users, pageRequest.toPageable(), users.size());

        when(userRepository.findByQuery(authUserId, searchQuery.toLowerCase(), pageRequest.toPageable())).thenReturn(usersPage);

        // When
        PagedResponse<UserSummaryDTO> actualUsersPage = userService.searchUser(authUserId, searchQuery, pageRequest);

        // Then
        assertThat(actualUsersPage.content().size()).isEqualTo(2);

        assertThat(actualUsersPage.content().get(0).getUsername()).isEqualTo(expectedUsers.get(0).getUsername());
        assertThat(actualUsersPage.content().get(0).getName()).isEqualTo(expectedUsers.get(0).getName());

        assertThat(actualUsersPage.content().get(1).getUsername()).isEqualTo(expectedUsers.get(1).getUsername());
        assertThat(actualUsersPage.content().get(1).getName()).isEqualTo(expectedUsers.get(1).getName());

        verify(userRepository, times(1)).findByQuery(authUserId, searchQuery.toLowerCase(), pageRequest.toPageable());
    }

    @Test
    @DisplayName("Should throw a ResourceNotFoundException when the user does not exist")
    void findPopularUsersWhenUserDoesNotExistThenThrowException() {
        // Given
        Long userId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> userService.findPopularUsers(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(0)).findPopularUsers(userId);
    }

    @Test
    @DisplayName("Should return a list of popular users when the user exists")
    void findPopularUsersWhenUserExists() {
        // Given
        Long userId = 1L;
        User user = new User(1L, "will.smith", "will.smith@example.com", "password", "Will Smith", null, null, null,
                Gender.MALE, null, null, userRole);

        List<User> popularUsers = List.of(
                new User(2L, "john.doe", "john.doe@example.com", "password", "John Doe", null, null, null,
                        Gender.MALE, null, null, userRole),
                new User(3L, "john.smith", "john.smith@example.com", "password", "John Smith", null, null, null,
                        Gender.MALE, null, null, userRole)
        );
        List<UserSummaryDTO> expectedPopularUsers = List.of(
                new UserSummaryDTO(2L, "john.doe", "John Doe", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(3L, "john.smith", "John Smith", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER"))
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.findPopularUsers(userId)).thenReturn(popularUsers);

        // When
        List<UserSummaryDTO> actualPopularUsers = userService.findPopularUsers(userId);

        // Then
        assertThat(actualPopularUsers.size()).isEqualTo(expectedPopularUsers.size());

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).findPopularUsers(userId);
        assertThat(actualPopularUsers.get(0).getUsername()).isEqualTo(expectedPopularUsers.get(0).getUsername());
        assertThat(actualPopularUsers.get(1).getUsername()).isEqualTo(expectedPopularUsers.get(1).getUsername());
    }

    @Test
    @DisplayName("Should return an empty list when no users exist")
    void findPopularUsersPublicWhenUsersDoNotExist() {
        // Given
        when(userRepository.findPopularUsers(null)).thenReturn(new ArrayList<>());

        // When
        List<UserSummaryDTO> actualPopularUsers = userService.findPopularUsersPublic();

        // Then
        assertThat(actualPopularUsers.isEmpty()).isTrue();
        verify(userRepository, times(1)).findPopularUsers(null);
    }

    @Test
    @DisplayName("Should return a list of popular users without excluding any user when users exist")
    void findPopularUsersPublicWhenUsersExist() {
        // Given
        List<User> popularUsers = List.of(
                new User(1L, "will.smith", "will.smith@example.com", "password", "Will Smith", null, null, null,
                        Gender.MALE, null, null, userRole),
                new User(2L, "john.doe", "john.doe@example.com", "password", "John Doe", null, null, null,
                        Gender.MALE, null, null, userRole),
                new User(3L, "john.smith", "john.smith@example.com", "password", "John Smith", null, null, null,
                        Gender.MALE, null, null, userRole)
        );
        List<UserSummaryDTO> expectedPopularUsers = List.of(
                new UserSummaryDTO(1L, "will.smith", "Will Smith", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(2L, "john.doe", "John Doe", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER")),
                new UserSummaryDTO(3L, "john.smith", "John Smith", null, null,
                        null, null, new LinkedHashSet<>(),
                        new LinkedHashSet<>(), false, new ArrayList<>(), List.of("ROLE_USER"))
        );

        when(userRepository.findPopularUsers(null)).thenReturn(popularUsers);

        // When
        List<UserSummaryDTO> actualPopularUsers = userService.findPopularUsersPublic();

        // Then
        assertThat(actualPopularUsers.size()).isEqualTo(expectedPopularUsers.size());

        verify(userRepository, times(1)).findPopularUsers(null);
        assertThat(actualPopularUsers.get(0).getUsername()).isEqualTo(expectedPopularUsers.get(0).getUsername());
        assertThat(actualPopularUsers.get(1).getUsername()).isEqualTo(expectedPopularUsers.get(1).getUsername());
        assertThat(actualPopularUsers.get(2).getUsername()).isEqualTo(expectedPopularUsers.get(2).getUsername());
    }

}

