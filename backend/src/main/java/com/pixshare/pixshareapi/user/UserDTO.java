package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.Comment;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.story.Story;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Objects;
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
    private String mobile;
    private String website;
    private String bio;
    private Gender gender;
    private String userImage;
    private Set<UserView> follower;
    private Set<UserView> following;
    private List<Story> stories;
    private Set<Post> savedPosts;
    private List<Post> posts;
    private List<Comment> comments;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDTO userDTO)) return false;
        return Objects.equals(id, userDTO.id) && Objects.equals(username, userDTO.username) && Objects.equals(email, userDTO.email) && Objects.equals(name, userDTO.name) && Objects.equals(mobile, userDTO.mobile) && Objects.equals(website, userDTO.website) && Objects.equals(bio, userDTO.bio) && gender == userDTO.gender && Objects.equals(userImage, userDTO.userImage) && Objects.equals(follower, userDTO.follower) && Objects.equals(following, userDTO.following) && Objects.equals(stories, userDTO.stories) && Objects.equals(savedPosts, userDTO.savedPosts) && Objects.equals(posts, userDTO.posts) && Objects.equals(comments, userDTO.comments);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, name, mobile, website, bio, gender, userImage, follower, following, stories, savedPosts, posts, comments);
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", mobile='" + mobile + '\'' +
                ", website='" + website + '\'' +
                ", bio='" + bio + '\'' +
                ", gender=" + gender +
                ", userImage='" + userImage + '\'' +
                ", follower=" + follower +
                ", following=" + following +
                ", stories=" + stories +
                ", savedPosts=" + savedPosts +
                ", posts=" + posts +
                ", comments=" + comments +
                '}';
    }
}
