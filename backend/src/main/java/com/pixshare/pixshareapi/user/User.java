package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.post.Post;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.BatchSize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor(force = true)
@Getter
@Setter
@Entity
@Table(name = "user_identity",
        uniqueConstraints = {
                @UniqueConstraint(name = "user_username_unique", columnNames = "username"),
                @UniqueConstraint(name = "user_email_unique", columnNames = "email")
        }
)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NonNull
    @Column(name = "username", nullable = false)
    private String userHandleName;

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

    @Size(max = 250)
    @Column(name = "website")
    private String website;

    @Size(max = 250)
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "user_image_upload_id")
    private String userImageUploadId;

    @Column(name = "user_image")
    private String userImage;

    @ToString.Exclude
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "user_follower",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    private Set<User> follower = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "follower")
    @BatchSize(size = 10)
    private Set<User> following = new LinkedHashSet<>();

    @ManyToMany(mappedBy = "savedByUsers")
    @BatchSize(size = 10)
    private Set<Post> savedPosts = new LinkedHashSet<>();

    public User(Long id, @NonNull String userHandleName, @NonNull String email, @NonNull String password, @NonNull String name, String mobile, String website, String bio, @NonNull Gender gender, String userImageUploadId, String userImage) {
        this.id = id;
        this.userHandleName = userHandleName;
        this.email = email;
        this.password = password;
        this.name = name;
        this.mobile = mobile;
        this.website = website;
        this.bio = bio;
        this.gender = gender;
        this.userImageUploadId = userImageUploadId;
        this.userImage = userImage;
    }

    public void addSavedPost(Post post) {
        this.savedPosts.add(post);
        post.getSavedByUsers().add(this);
    }

    public void removeSavedPost(Post post) {
        this.savedPosts.remove(post);
        post.getSavedByUsers().remove(this);
    }

    public void addFollower(User user) {
        this.follower.add(user);
        user.getFollowing().add(this);
    }

    public void removeFollower(User user) {
        this.follower.remove(user);
        user.getFollowing().remove(this);
    }

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public @NonNull String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}