package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.post.Post;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_identity_id_seq")
    @SequenceGenerator(name = "user_identity_id_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @NonNull
    @NotBlank
    @Pattern(regexp = "^(?![^a-z\\d])[a-z\\d][a-z\\d_.+-]*$",
            message = "Username must start with an alphanumeric character (a-z, 0-9) and can contain alphanumeric characters, underscore (_), period (.), dash (-), or plus (+)")
    @Size(min = 5, max = 50)
    @Column(name = "username", nullable = false)
    private String userHandleName;

    @NonNull
    @NotBlank
    @Email
    @Column(name = "email", nullable = false)
    private String email;

    @NonNull
    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%&*\\-_=./])[A-Za-z\\d!@#$%&*\\-_=./]+$",
            message = "Password must include at least one alphabet, one digit and one special character (!@#$%&*-_=./)")
    @Size(min = 8, max = 128)
    @Column(name = "password", nullable = false)
    private String password;

    @NonNull
    @NotBlank
    @Pattern(regexp = "^[a-zA-Z][a-zA-Z '.-]+$",
            message = "Name must start with an alphabetic character (a-zA-Z) and can contain alphabetic characters (both uppercase and lowercase), spaces, hyphens, apostrophes, single quotes, and periods")
    @Size(min = 3, max = 128)
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 15)
    @Column(name = "mobile")
    private String mobile;

    @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w.-]*)/?$|^$",
            message = "Must be a valid URL")
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

    @NonNull
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

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

    public User(Long id, @NonNull String userHandleName, @NonNull String email, @NonNull String password, @NonNull String name, String mobile, String website, String bio, @NonNull Gender gender, String userImageUploadId, String userImage, @NonNull Role role) {
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
        this.role = role;
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
        final String ROLE_PREFIX = "ROLE_";

        return List.of(new SimpleGrantedAuthority(
                ROLE_PREFIX + Optional.ofNullable(role)
                        .map(Role::getRoleName)
                        .orElse(RoleName.USER.name())
        ));
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