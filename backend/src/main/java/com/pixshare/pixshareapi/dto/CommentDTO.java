package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.time.ZonedDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class CommentDTO {
    private Long id;
    private String content;
    private ZonedDateTime createdAt;
    private UserView user;
    private Set<UserView> likedByUsers;
    private Boolean isLikedByAuthUser;
}
