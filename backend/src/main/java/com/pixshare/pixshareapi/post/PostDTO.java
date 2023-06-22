package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.comment.Comment;
import com.pixshare.pixshareapi.user.UserView;
import lombok.*;

import java.time.LocalDateTime;
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
    private String image;
    private String location;
    private LocalDateTime createdAt;
    private UserView user;
    private List<Comment> comments;
    private Set<UserView> likedByUsers;
}
