package com.pixshare.pixshareapi.upload;

import lombok.Getter;

@Getter
public enum UploadType {
    AVATAR("avatar"),
    POST("post"),
    STORY("story");

    private final String uploadFolder;

    UploadType(String uploadFolder) {
        this.uploadFolder = uploadFolder;
    }

}
