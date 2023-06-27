package com.pixshare.pixshareapi.post;

public record PostRequest(
        String caption,
        String image,
        String location
) {
}
