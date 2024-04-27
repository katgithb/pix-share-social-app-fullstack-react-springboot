package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String name;
    private String website;
    private String bio;
    private String userImageUploadId;
    private String userImage;
    private Set<UserView> follower;
    private Set<UserView> following;
    private Boolean isFollowedByAuthUser;
    private List<StoryDTO> stories;
    private List<String> roles;
}
