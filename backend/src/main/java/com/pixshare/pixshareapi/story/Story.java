package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.*;
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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "story_id_seq")
    @SequenceGenerator(name = "story_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NonNull
    @Column(name = "image_upload_id", nullable = false)
    private String imageUploadId;

    @NonNull
    @Column(name = "image", nullable = false)
    private String image;

    @Size(max = 250)
    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    @NonNull
    @PastOrPresent
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Story(String imageUploadId, String image, String caption, LocalDateTime timestamp, User user) {
        this.imageUploadId = imageUploadId;
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