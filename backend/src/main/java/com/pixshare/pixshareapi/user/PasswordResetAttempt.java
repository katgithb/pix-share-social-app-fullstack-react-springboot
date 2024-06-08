package com.pixshare.pixshareapi.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "password_reset_attempt",
        uniqueConstraints = {
                @UniqueConstraint(name = "email_timestamp_unique", columnNames = {"email", "timestamp"})
        }
)
public class PasswordResetAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "password_reset_attempt_id_seq")
    @SequenceGenerator(name = "password_reset_attempt_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NonNull
    @NotBlank
    @Email
    @Column(name = "email", nullable = false)
    private String email;

    @NonNull
    @Positive
    @Column(name = "timestamp", nullable = false)
    private Long timestamp;

    @NonNull
    @NotNull
    @Column(name = "succeeded", nullable = false)
    private Boolean succeeded;

    public PasswordResetAttempt(@NonNull String email, @NonNull Long timestamp) {
        this.email = email;
        this.timestamp = timestamp;
        this.succeeded = false; // Set to false by default
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PasswordResetAttempt that = (PasswordResetAttempt) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}