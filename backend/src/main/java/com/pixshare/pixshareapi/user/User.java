package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.UserView;
import com.pixshare.pixshareapi.post.Post;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@AllArgsConstructor
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

//    @ToString.Exclude
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Post> posts = new ArrayList<>();
//
//    @ToString.Exclude
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Comment> comments = new ArrayList<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name = "user_follower", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserView> follower = new LinkedHashSet<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name = "user_following", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserView> following = new LinkedHashSet<>();

//    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
//    @JoinColumn(name = "user_id")
//    private List<Story> stories = new ArrayList<>();

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

//    public User(Long id, @NonNull String username, @NonNull String email, @NonNull String password, @NonNull String name, String mobile, String website, String bio, @NonNull Gender gender, String userImage, Set<UserView> follower, Set<UserView> following, List<Story> stories, Set<Post> savedPosts) {
//        this.id = id;
//        this.username = username;
//        this.email = email;
//        this.password = password;
//        this.name = name;
//        this.mobile = mobile;
//        this.website = website;
//        this.bio = bio;
//        this.gender = gender;
//        this.userImage = userImage;
//        this.follower = follower;
//        this.following = following;
//        this.stories = stories;
//        this.savedPosts = savedPosts;
//    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        User user = (User) o;
        return getId() != null && Objects.equals(getId(), user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}