package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.LocalDateTime;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "story")
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "story_seq")
    @SequenceGenerator(name = "story_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "image_upload_id")
    private String imageUploadId;

    @Column(name = "image")
    private String image;

    @Size(max = 250)
    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Story(String image, String caption, LocalDateTime timestamp, User user) {
        this.image = image;
        this.caption = caption;
        this.timestamp = timestamp;
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Story story = (Story) o;
        return getId() != null && Objects.equals(getId(), story.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}