package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.Comment;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.story.Story;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String userImage;
}
