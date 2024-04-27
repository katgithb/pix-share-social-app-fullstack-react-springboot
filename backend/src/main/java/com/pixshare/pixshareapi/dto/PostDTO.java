package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PostDTO {
    private Long id;
    private String caption;
    private String imageUploadId;
    private String image;
    private String location;
    private ZonedDateTime createdAt;
    private UserView user;
    private List<CommentDTO> comments;
    private Set<UserView> likedByUsers;
    private Boolean isLikedByAuthUser;
    private Boolean isSavedByAuthUser;
}
