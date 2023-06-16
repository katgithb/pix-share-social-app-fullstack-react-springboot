package com.pixshare.pixshareapi.post;

import com.pixshare.pixshareapi.comment.Comment;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
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

    @ToString.Exclude
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Embedded
    @ElementCollection
    @JoinTable(name = "post_liked_by_users", joinColumns = @JoinColumn(name = "user_id"))
    private Set<UserDTO> likedByUsers = new LinkedHashSet<>();

    @ToString.Exclude
    @ManyToMany(mappedBy = "savedPosts")
    private Set<User> savedByUsers = new LinkedHashSet<>();

}