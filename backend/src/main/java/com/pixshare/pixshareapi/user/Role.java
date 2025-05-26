package com.pixshare.pixshareapi.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "roles",
        uniqueConstraints = {
                @UniqueConstraint(name = "role_name_unique", columnNames = "role_name")
        }
)
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "roles_id_seq")
    @SequenceGenerator(name = "roles_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Short id;

    @NonNull
    @NotBlank
    @Size(max = 50)
    @Column(name = "role_name", nullable = false)
    private String roleName;

    public Role(@NonNull String roleName) {
        this.roleName = roleName;
    }

    public static Role of(RoleName roleName) {
        return new Role(roleName.name());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o))
            return false;
        Role role = (Role) o;
        return getId() != null && Objects.equals(getId(), role.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return roleName;
    }
}