package com.pixshare.pixshareapi.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;
import org.hibernate.Hibernate;

import java.time.OffsetDateTime;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "reactivation_request",
        uniqueConstraints = {
                @UniqueConstraint(name = "reactivation_request_email_unique", columnNames = "email")
        }
)
public class ReactivationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reactivation_request_id_seq")
    @SequenceGenerator(name = "reactivation_request_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NonNull
    @NotBlank
    @Email
    @Column(name = "email", nullable = false)
    private String email;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReactivationRequestStatus status = ReactivationRequestStatus.PENDING;

    @NonNull
    @PastOrPresent
    @Column(name = "requested_at", nullable = false, updatable = false)
    private OffsetDateTime requestedAt;

    @PastOrPresent
    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public ReactivationRequest(@NonNull String email) {
        this.email = email;
        this.requestedAt = OffsetDateTime.now();
    }

    public ReactivationRequest(@NonNull String email, User user) {
        this(email);
        this.user = user;
    }

    public ReactivationRequest(@NonNull String email, User user, ReactivationRequestStatus status) {
        this(email, user);
        this.status = status;
    }

    /**
     * Updates the status of the reactivation request and records the review timestamp.
     */
    public void updateStatus(ReactivationRequestStatus newStatus) {
        if (this.status != newStatus) {
            this.status = newStatus;
            this.reviewedAt = OffsetDateTime.now();
        }
    }

    /**
     * Sets the creation timestamp before persisting a new entity.
     */
    @PrePersist
    protected void onCreate() {
        this.requestedAt = OffsetDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        ReactivationRequest that = (ReactivationRequest) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}