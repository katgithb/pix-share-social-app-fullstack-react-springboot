package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.dto.UserView;
import com.pixshare.pixshareapi.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq")
    @SequenceGenerator(name = "post_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "caption")
    private String caption;

    @Column(name = "image")
    private String image;

    @Column(name = "location")
    private String location;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

//    @ToString.Exclude
//    @OneToMany(mappedBy = "post", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Comment> comments = new ArrayList<>();

    @Embedded
    @ElementCollection
    @JoinTable(name = "post_liked_by_users", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserView> likedByUsers = new LinkedHashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Post post = (Post) o;
        return getId() != null && Objects.equals(getId(), post.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}