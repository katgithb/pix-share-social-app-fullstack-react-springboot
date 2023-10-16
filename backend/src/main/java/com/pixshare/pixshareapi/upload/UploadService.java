package com.pixshare.pixshareapi.upload;

import com.pixshare.pixshareapi.exception.CloudinaryResourceException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.Map;

public interface UploadService {

    Map<String, String> generateCloudinaryUploadSignature(Long userId, UploadSignatureRequest signatureRequest) throws ResourceNotFoundException;

    Map<String, String> uploadImageResourceToCloudinary(Long userId, byte[] imageBytes, UploadSignatureRequest signatureRequest) throws ResourceNotFoundException, CloudinaryResourceException;

    void deleteCloudinaryImageResourceByPublicId(String publicId, boolean invalidate) throws CloudinaryResourceException;

}
