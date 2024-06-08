package com.pixshare.pixshareapi.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetAttemptRepository extends JpaRepository<PasswordResetAttempt, Long> {
    boolean existsByEmailAndTimestamp(String email, Long timestamp);

    Optional<PasswordResetAttempt> findByEmailAndTimestamp(String email, Long timestamp);

    Long countByEmailAndTimestampAfter(String email, long threshold);

    List<PasswordResetAttempt> findAllByTimestampBefore(long threshold);

}