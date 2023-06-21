package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.comment.Comment;
import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.story.Story;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@RequiredArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@Entity
@Table(name = "\"user\"",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_email_unique", columnNames = "email")
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NonNull
    @Column(name = "username", nullable = false)
    private String username;

    @NonNull
    @Column(name = "email", nullable = false)
    private String email;

    @NonNull
    @Column(name = "password", nullable = false)
    private String password;

    @NonNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "website")
    private String website;

    @Column(name = "bio")
    private String bio;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "user_image")
    private String userImage;

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name = "user_follower", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserView> follower = new LinkedHashSet<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name = "user_following", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserView> following = new LinkedHashSet<>();

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private List<Story> stories = new ArrayList<>();

    @ToString.Exclude
    @ManyToMany
    @JoinTable(name = "user_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id"))
    private Set<Post> savedPosts = new LinkedHashSet<>();

    public User(Long id, @NonNull String username, @NonNull String email, @NonNull String password, @NonNull String name, String mobile, String website, String bio, @NonNull Gender gender, String userImage) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.mobile = mobile;
        this.website = website;
        this.bio = bio;
        this.gender = gender;
        this.userImage = userImage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id) && Objects.equals(username, user.username) && Objects.equals(email, user.email) && Objects.equals(password, user.password) && Objects.equals(name, user.name) && Objects.equals(mobile, user.mobile) && Objects.equals(website, user.website) && Objects.equals(bio, user.bio) && gender == user.gender && Objects.equals(userImage, user.userImage) && Objects.equals(posts, user.posts) && Objects.equals(comments, user.comments) && Objects.equals(follower, user.follower) && Objects.equals(following, user.following) && Objects.equals(stories, user.stories) && Objects.equals(savedPosts, user.savedPosts);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, password, name, mobile, website, bio, gender, userImage, posts, comments, follower, following, stories, savedPosts);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", mobile='" + mobile + '\'' +
                ", website='" + website + '\'' +
                ", bio='" + bio + '\'' +
                ", gender=" + gender +
                ", userImage='" + userImage + '\'' +
                ", posts=" + posts +
                ", comments=" + comments +
                ", follower=" + follower +
                ", following=" + following +
                ", stories=" + stories +
                ", savedPosts=" + savedPosts +
                '}';
    }
}