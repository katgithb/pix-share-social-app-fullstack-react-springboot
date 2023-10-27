package com.pixshare.pixshareapi.post;

import org.springframework.web.multipart.MultipartFile;

public record PostRequest(
        String caption,
        MultipartFile image,
        String location
) {
}
