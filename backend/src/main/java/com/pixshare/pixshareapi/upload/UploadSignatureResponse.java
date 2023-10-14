package com.pixshare.pixshareapi.upload;

public record UploadSignatureResponse(
        String uploadSignature,
        String timestamp,
        String publicId
) {
}
