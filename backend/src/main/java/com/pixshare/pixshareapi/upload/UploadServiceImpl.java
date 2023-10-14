package com.pixshare.pixshareapi.upload;

import com.cloudinary.Cloudinary;
import com.pixshare.pixshareapi.exception.CloudinaryResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.post.PostRepository;
import com.pixshare.pixshareapi.story.Story;
import com.pixshare.pixshareapi.story.StoryRepository;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
public class UploadServiceImpl implements UploadService {

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    private final StoryRepository storyRepository;

    private final Cloudinary cloudinary;

    @Value("${cloudinary.upload-preset}")
    private String cloudinaryUploadPreset;


    public UploadServiceImpl(UserRepository userRepository, PostRepository postRepository, StoryRepository storyRepository, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.storyRepository = storyRepository;
        this.cloudinary = cloudinary;
    }


    @Override
    public Map<String, String> generateCloudinaryUploadSignature(Long userId, UploadSignatureRequest signatureRequest) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        Long recordId = signatureRequest.recordId();
        String uploadType = signatureRequest.uploadType();
        long timestamp = System.currentTimeMillis() / 1000L;
        System.out.println("Upload type: " + uploadType);

        String publicId = getPublicIdFromUploadType(user.getId(), recordId, uploadType);

        Map<String, Object> paramsToSign = Map.of("timestamp", String.valueOf(timestamp), "public_id", publicId);
        String apiSecret = cloudinary.config.apiSecret;
        System.out.println("Public id: " + publicId);

        String uploadSignature = cloudinary.apiSignRequest(
                paramsToSign, apiSecret
        );

        return Map.of("uploadSignature", uploadSignature, "timestamp", String.valueOf(timestamp), "public_id", publicId);
    }

    @Override
    public Map<String, String> uploadImageResourceToCloudinary(Long userId, byte[] imageBytes, UploadSignatureRequest signatureRequest)
            throws ResourceNotFoundException, CloudinaryResourceException {
        // Generate upload signature
        Map<String, String> uploadSignature = generateCloudinaryUploadSignature(userId, signatureRequest);

        // Set upload options for the image
        Map<String, Object> uploadOptions = new HashMap<>();
        uploadOptions.put("public_id", uploadSignature.get("public_id"));
        uploadOptions.put("timestamp", uploadSignature.get("timestamp"));
        uploadOptions.put("signature", uploadSignature.get("uploadSignature"));
        uploadOptions.put("format", "jpg");
        uploadOptions.put("upload_preset", cloudinaryUploadPreset);

        try {
            // Upload the image to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(imageBytes, uploadOptions);

            String publicId = (String) uploadResult.get("public_id");
            String secureUrl = (String) uploadResult.get("secure_url");
            System.out.println("Public ID: " + publicId);
            System.out.println("Secure URL: " + secureUrl);

            // Return public ID and secure URL of the uploaded image
            return Map.of("publicId", publicId, "secureUrl", secureUrl);
        } catch (IOException e) {
            System.out.println(e.getMessage());
            throw new CloudinaryResourceException("Failed to upload image resource");
        }
    }

    @Override
    public void deleteCloudinaryImageResourceByPublicId(String publicId, boolean invalidate) throws CloudinaryResourceException {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("invalidate", invalidate);

            cloudinary.uploader().destroy(publicId, options);
        } catch (IOException e) {
            throw new CloudinaryResourceException("Failed to delete image resource with public ID: " + publicId);
        }
    }

    private String getPublicIdFromUploadType(Long userId, Long entityId, String uploadType) {
        UploadType uploadTypeValue = getUploadTypeFromString(uploadType);

        Long id = uploadTypeValue.equals(UploadType.AVATAR) ? userId : entityId;
        Function<Long, String> uploadTypeAction = getUploadTypeActionMap().get(uploadTypeValue);

        return Optional.ofNullable(id)
                .map(uploadTypeAction)
                .orElseThrow(() -> new RequestValidationException("Invalid ID provided"));
    }

    private UploadType getUploadTypeFromString(String uploadType) {

        return Optional.ofNullable(uploadType)
                .filter(type -> !type.isBlank())
                .map(type -> {
                    try {
                        return UploadType.valueOf(type);
                    } catch (IllegalArgumentException e) {
                        throw new RequestValidationException("Invalid upload type: " + type.trim());
                    }
                })
                .orElseThrow(() -> new RequestValidationException("Upload type is required"));

    }

    private Map<UploadType, Function<Long, String>> getUploadTypeActionMap() {
        String rootFolder = "pixshare_upload";

        return Map.of(
                UploadType.AVATAR, (Long userId) -> {
                    User user = userRepository.getReferenceById(userId);

                    String randomPublicId = rootFolder + "/" + buildCloudinaryPublicId(UploadType.AVATAR, user.getId());
                    return Optional.ofNullable(user.getUserImageUploadId())
                            .filter(imageUploadId -> !imageUploadId.isBlank())
                            .orElse(randomPublicId);
                },
                UploadType.POST, (Long postId) -> {
                    Post post = postRepository.findById(postId)
                            .orElseThrow(() -> new ResourceNotFoundException("Post with id [%s] not found".formatted(postId)));

                    String randomPublicId = rootFolder + "/" + buildCloudinaryPublicId(UploadType.POST, post.getId());
                    return Optional.ofNullable(post.getImageUploadId())
                            .filter(imageUploadId -> !imageUploadId.isBlank())
                            .orElse(randomPublicId);
                },
                UploadType.STORY, (Long storyId) -> {
                    Story story = storyRepository.findById(storyId)
                            .orElseThrow(() -> new ResourceNotFoundException("Story with id [%s] not found".formatted(storyId)));

                    String randomPublicId = rootFolder + "/" + buildCloudinaryPublicId(UploadType.STORY, story.getId());
                    return Optional.ofNullable(story.getImageUploadId())
                            .filter(imageUploadId -> !imageUploadId.isBlank())
                            .orElse(randomPublicId);
                }
        );
    }

    private String buildCloudinaryPublicId(UploadType uploadType, Long entityId) {
        String uploadFolder = uploadType.getUploadFolder();
        String encodedId = encodeEntityIdForPublicId(entityId);
        String randomPublicId = cloudinary.randomPublicId();
        return uploadFolder + "/" + encodedId + randomPublicId;
    }

    private String encodeEntityIdForPublicId(Long id) {
        String idPrefix = "SN";
        String idSuffix = "__#";
        int startIndex = 1000;
        String encodedId = idPrefix + (startIndex + id) + idSuffix;
        return encodeToBase64(encodedId);
    }

    private String encodeToBase64(String value) {
        return Base64.getEncoder().encodeToString(value.getBytes());
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf(".");
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        } else {
            throw new RequestValidationException("Invalid filename: " + filename);
        }
    }

}
