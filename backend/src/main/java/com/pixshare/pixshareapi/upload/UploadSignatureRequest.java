package com.pixshare.pixshareapi.upload;

public record UploadSignatureRequest(
        Long recordId,
        String uploadType
) {
}
