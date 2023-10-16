package com.pixshare.pixshareapi.dto;

import com.pixshare.pixshareapi.user.Gender;
import lombok.*;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String mobile;
    private String website;
    private String bio;
    private Gender gender;
    private String userImageUploadId;
    private String userImage;
    private Set<UserView> follower;
    private Set<UserView> following;
    private List<StoryDTO> stories;
    private Set<PostDTO> savedPosts;
    private List<String> roles;
}
