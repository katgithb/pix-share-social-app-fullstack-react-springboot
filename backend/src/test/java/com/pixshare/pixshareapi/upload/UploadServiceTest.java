package com.pixshare.pixshareapi.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.pixshare.pixshareapi.exception.CloudinaryResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.story.StoryRepository;
import com.pixshare.pixshareapi.user.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@ExtendWith(MockitoExtension.class)
@Import(CloudinaryTestConfig.class)
public class UploadServiceTest {

    private UploadService uploadService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private StoryRepository storyRepository;
    @Mock
    private Uploader uploader;
    @SpyBean
    private Cloudinary cloudinary;

    private Role userRole;

    @BeforeEach
    public void setUp() {
        uploadService = new UploadServiceImpl(userRepository, postRepository, storyRepository, cloudinary);

        Short userRoleId = 1;
        userRole = Role.of(RoleName.USER);
        userRole.setId(userRoleId);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user does not exist")
    void generateCloudinaryUploadSignature_whenUserDoesNotExist_thenThrowsException() {
        // Arrange
        Long userId = 1L;
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(1L, "avatar");
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> uploadService.generateCloudinaryUploadSignature(userId, signatureRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User with id [%s] not found".formatted(userId));

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw RequestValidationException when uploadType is null or empty")
    void generateCloudinaryUploadSignature_whenUploadTypeIsNullOrEmpty_thenThrowsException() {
        // Arrange
        Long userId = 1L;
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, null);
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> uploadService.generateCloudinaryUploadSignature(userId, signatureRequest))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Upload type is required");

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw RequestValidationException when uploadType is invalid")
    void generateCloudinaryUploadSignature_whenUploadTypeIsInvalid_thenThrowsException() {
        // Arrange
        Long userId = 1L;
        String invalidUploadType = "invalid";
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, invalidUploadType);
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> uploadService.generateCloudinaryUploadSignature(userId, signatureRequest))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Invalid upload type: " + invalidUploadType);

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw RequestValidationException when recordId is null or empty")
    void generateCloudinaryUploadSignature_whenRecordIdIsNullOrEmpty_thenThrowsException() {
        // Arrange
        Long userId = 1L;
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "POST");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(() -> uploadService.generateCloudinaryUploadSignature(userId, signatureRequest))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("Invalid ID provided");

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should use the user's existing userImageUploadId as public ID if available")
    void generateCloudinaryUploadSignature_whenUserHasExistingUserImageUploadId_thenUseItAsPublicId() {
        // Arrange
        Long userId = 1L;
        String existingUserImageUploadId = "existingImageUploadId";
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "AVATAR");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, existingUserImageUploadId, "imageUrl", userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        // Act
        Map<String, String> result = uploadService.generateCloudinaryUploadSignature(userId, signatureRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(3);
        assertThat(result).containsKeys("uploadSignature", "timestamp", "public_id");

        assertThat(result.get("public_id")).isEqualTo(existingUserImageUploadId);
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should generate a random public ID when user does not have an existing userImageUploadId")
    void generateCloudinaryUploadSignature_whenUserHasNoExistingUserImageUploadId_thenGenerateRandomPublicId() {
        // Arrange
        Long userId = 1L;
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "AVATAR");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        // Act
        Map<String, String> result = uploadService.generateCloudinaryUploadSignature(userId, signatureRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(3);
        assertThat(result).containsKeys("uploadSignature", "timestamp", "public_id");

        assertThat(result.get("public_id")).isNotNull().isNotEmpty();
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should generate a valid cloudinary upload signature map when valid parameters are provided")
    void generateCloudinaryUploadSignature_whenValidParameters_thenReturnSignatureMap() {
        // Arrange
        Long userId = 1L;
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "AVATAR");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        // Act
        Map<String, String> result = uploadService.generateCloudinaryUploadSignature(userId, signatureRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(3);
        assertThat(result).containsKeys("uploadSignature", "timestamp", "public_id");

        assertThat(result.get("uploadSignature")).isNotNull().isNotEmpty();
        assertThat(result.get("timestamp")).isNotNull().isNotEmpty();
        assertThat(result.get("public_id")).isNotNull().isNotEmpty();
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw CloudinaryResourceException when cloudinary upload fails")
    void uploadImageResourceToCloudinary_whenCloudinaryUploadFails_thenThrowsException() throws IOException {
        // Arrange
        Long userId = 1L;
        byte[] imageBytes = new byte[]{};
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "AVATAR");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.getReferenceById(userId)).thenReturn(user);
        doThrow(IOException.class).when(uploader).upload(any(byte[].class), anyMap());
        when(cloudinary.uploader()).thenReturn(uploader);

        // Act & Assert
        assertThatThrownBy(() -> uploadService.uploadImageResourceToCloudinary(userId, imageBytes, signatureRequest))
                .isInstanceOf(CloudinaryResourceException.class)
                .hasMessage("Failed to upload image resource");

        verify(userRepository, times(1)).findById(userId);
        verify(uploader, times(1)).upload(any(byte[].class), anyMap());
    }

    @Test
    @DisplayName("Should upload image to Cloudinary and return publicId and secureUrl when user and image are valid")
    void uploadImageResourceToCloudinary_whenUserAndImageAreValid_thenUploadAndReturnPublicIdAndSecureUrl() throws IOException {
        // Arrange
        Long userId = 1L;
        byte[] imageBytes = new byte[10];
        UploadSignatureRequest signatureRequest = new UploadSignatureRequest(null, "AVATAR");
        User user = new User(userId, "user1", "user1@gmail.com", "password", "User1", null, null, null, Gender.MALE, null, null, userRole);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.getReferenceById(userId)).thenReturn(user);

        Map<String, Object> uploadResult = Map.of("public_id", "uploadedImagePublicId", "secure_url", "uploadedImageSecureUrl");
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(uploadResult);
        when(cloudinary.uploader()).thenReturn(uploader);

        // Act
        Map<String, String> result = uploadService.uploadImageResourceToCloudinary(userId, imageBytes, signatureRequest);

        // Assert
        verify(userRepository, times(1)).findById(userId);
        verify(uploader, times(1)).upload(any(byte[].class), anyMap());

        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);
        assertThat(result).containsKeys("publicId", "secureUrl");
        assertThat(result.get("publicId")).isEqualTo("uploadedImagePublicId");
        assertThat(result.get("secureUrl")).isEqualTo("uploadedImageSecureUrl");

    }

    @Test
    @DisplayName("Should throw CloudinaryResourceException when deleting image resource fails")
    void deleteCloudinaryImageResourceByPublicId_whenDeleteImageResourceFails_thenThrowsException() throws IOException {
        // Arrange
        String publicId = "publicId";
        boolean invalidate = true;
        doThrow(IOException.class).when(uploader).destroy(eq(publicId), anyMap());
        when(cloudinary.uploader()).thenReturn(uploader);

        // Act & Assert
        assertThatThrownBy(() -> uploadService.deleteCloudinaryImageResourceByPublicId(publicId, invalidate))
                .isInstanceOf(CloudinaryResourceException.class)
                .hasMessage("Failed to delete image resource with public ID: " + publicId);

        verify(uploader, times(1)).destroy(eq(publicId), anyMap());
    }

    @Test
    @DisplayName("Should delete image resource from Cloudinary when public ID is valid")
    void deleteCloudinaryImageResourceByPublicId_whenPublicIdIsValid_thenDeleteImageResourceFromCloudinary() throws IOException {
        // Arrange
        String publicId = "publicId";
        boolean invalidate = true;
        Map<String, Object> options = Map.of("invalidate", invalidate);
        Map<String, Object> destroyResult = Map.of("result", "ok");
        when(uploader.destroy(publicId, options)).thenReturn(destroyResult);
        when(cloudinary.uploader()).thenReturn(uploader);

        // Act
        uploadService.deleteCloudinaryImageResourceByPublicId(publicId, invalidate);

        // Assert
        verify(uploader, times(1)).destroy(publicId, options);
    }


}