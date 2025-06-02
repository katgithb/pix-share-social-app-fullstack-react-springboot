package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.post.Post;
import com.pixshare.pixshareapi.util.AppConstants;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.BatchSize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.OffsetDateTime;
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

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @PastOrPresent
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PastOrPresent
    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @PastOrPresent
    @Column(name = "status_changed_at")
    private OffsetDateTime statusChangedAt;

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

    public User(Long id, @NonNull String userHandleName, @NonNull String email, @NonNull String password, @NonNull String name,
                String mobile, String website, String bio, @NonNull Gender gender, String userImageUploadId, String userImage,
                @NonNull Role role, @NonNull UserStatus status, OffsetDateTime createdAt, OffsetDateTime lastLoginAt,
                OffsetDateTime statusChangedAt) {
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
        this.status = status;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.statusChangedAt = statusChangedAt;
    }

    public User(Long id, @NonNull String userHandleName, @NonNull String email, @NonNull String password, @NonNull String name,
                String mobile, String website, String bio, @NonNull Gender gender, String userImageUploadId, String userImage,
                @NonNull Role role) {
        this(id, userHandleName, email, password, name, mobile, website, bio, gender, userImageUploadId, userImage, role,
                UserStatus.ACTIVE, OffsetDateTime.now(), null, null);
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

    /**
     * Updates the user status and records the time of the status change.
     */
    public void updateStatus(UserStatus newStatus) {
        if (this.status != newStatus) {
            this.status = newStatus;
            this.statusChangedAt = OffsetDateTime.now();
        }
    }

    /**
     * Records the current login time when a user logs in.
     */
    public void recordLogin() {
        this.lastLoginAt = OffsetDateTime.now();
    }

    /**
     * Sets the creation timestamp before persisting a new user entity.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
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
        return List.of(new SimpleGrantedAuthority(
                AppConstants.ROLE_PREFIX + role.getRoleName()
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
        return status != UserStatus.EXPIRED;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.BLOCKED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status != UserStatus.INACTIVE;
    }

}