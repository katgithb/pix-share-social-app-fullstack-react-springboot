package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.AbstractTestcontainers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PasswordResetAttemptRepositoryTest extends AbstractTestcontainers {

    @Autowired
    PasswordResetAttemptRepository passwordResetAttemptRepository;

    private String email;

    @BeforeEach
    void setUp() {
        passwordResetAttemptRepository.deleteAll();

        email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
    }

    @Test
    @DisplayName("Should return false when a password reset attempt with the given email and timestamp does not exist")
    void existsByEmailAndTimestampWhenPasswordResetAttemptDoesNotExist() {
        // Given
        long timestamp = System.currentTimeMillis();

        // When
        boolean actual = passwordResetAttemptRepository.existsByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    @DisplayName("Should return true when a password reset attempt with the given email and timestamp exists")
    void existsByEmailAndTimestampWhenPasswordResetAttemptExists() {
        // Given
        long timestamp = System.currentTimeMillis();
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);
        passwordResetAttemptRepository.save(attempt);

        // When
        boolean actual = passwordResetAttemptRepository.existsByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    @DisplayName("Should return an empty Optional when the password reset attempt with the given email and timestamp does not exist")
    void findByEmailAndTimestampWhenEmailAndTimestampDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";
        long timestamp = System.currentTimeMillis() + 1000;

        // When
        Optional<PasswordResetAttempt> actualAttempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actualAttempt).isEmpty();
    }

    @Test
    @DisplayName("Should return an empty Optional when the password reset attempt with the given email does not exist")
    void findByEmailAndTimestampWhenEmailDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";
        long timestamp = System.currentTimeMillis();

        // When
        Optional<PasswordResetAttempt> actualAttempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actualAttempt).isEmpty();
    }

    @Test
    @DisplayName("Should return an empty Optional when the password reset attempt with the given timestamp does not exist")
    void findByEmailAndTimestampWhenTimestampDoesNotExist() {
        // Given
        long timestamp = System.currentTimeMillis() + 1000;

        // When
        Optional<PasswordResetAttempt> actualAttempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actualAttempt).isEmpty();
    }

    @Test
    @DisplayName("Should return an Optional containing the password reset attempt when the password reset attempt with the given email and timestamp exists")
    void findByEmailAndTimestampWhenEmailAndTimestampExists() {
        // Given
        long timestamp = System.currentTimeMillis();
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);
        passwordResetAttemptRepository.save(attempt);

        // When
        Optional<PasswordResetAttempt> actualAttempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        // Then
        assertThat(actualAttempt).isPresent();
        assertThat(actualAttempt.get()).isEqualTo(attempt);
    }

    @Test
    @DisplayName("Should return 0 when no password reset attempts exist with the given email and timestamp after the given threshold")
    void countByEmailAndTimestampAfterWhenEmailAndTimestampAfterTheGivenThresholdDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";
        long currentTimeMillis = System.currentTimeMillis();
        long threshold = currentTimeMillis + 1000;
        long attemptsCount = 0;

        // When
        Long actualAttemptsCount = passwordResetAttemptRepository.countByEmailAndTimestampAfter(email, threshold);

        // Then
        assertThat(actualAttemptsCount).isEqualTo(attemptsCount);
    }

    @Test
    @DisplayName("Should return 0 when no password reset attempts exist with the given email")
    void countByEmailAndTimestampAfterWhenEmailDoesNotExist() {
        // Given
        String email = "nonexistentuser@example.com";
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;
        long threshold = currentTimeMillis - attemptWindowDurationMillis;
        long attemptsCount = 0;

        // When
        Long actualAttemptsCount = passwordResetAttemptRepository.countByEmailAndTimestampAfter(email, threshold);

        // Then
        assertThat(actualAttemptsCount).isEqualTo(attemptsCount);
    }

    @Test
    @DisplayName("Should return 0 when no password reset attempts exist with the timestamp after the given threshold")
    void countByEmailAndTimestampAfterWhenTimestampAfterTheGivenThresholdDoesNotExist() {
        // Given
        long currentTimeMillis = System.currentTimeMillis();
        long threshold = currentTimeMillis + 1000;
        long attemptsCount = 0;

        // When
        Long actualAttemptsCount = passwordResetAttemptRepository.countByEmailAndTimestampAfter(email, threshold);

        // Then
        assertThat(actualAttemptsCount).isEqualTo(attemptsCount);
    }

    @Test
    @DisplayName("Should return the count of password reset attempts that exist with the given email and timestamp after the given threshold")
    void countByEmailAndTimestampAfterWhenEmailAndTimestampAfterTheGivenThresholdExists() {
        // Given
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;
        long threshold = currentTimeMillis - attemptWindowDurationMillis;

        List<PasswordResetAttempt> attempts = List.of(
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 2),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 3),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 4)
        );
        passwordResetAttemptRepository.saveAll(attempts);
        long attemptsCount = attempts.size();

        // When
        Long actualAttemptsCount = passwordResetAttemptRepository.countByEmailAndTimestampAfter(email, threshold);

        // Then
        assertThat(actualAttemptsCount).isEqualTo(attemptsCount);
    }

    @Test
    @DisplayName("Should return an empty list when no password reset attempts exist with the timestamp before the given threshold")
    void findAllByTimestampBeforeWhenTimestampBeforeTheGivenThresholdDoesNotExist() {
        // Given
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;
        long threshold = currentTimeMillis - attemptWindowDurationMillis;

        List<PasswordResetAttempt> attempts = List.of(
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 2),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 3),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 4)
        );
        passwordResetAttemptRepository.saveAll(attempts);

        // When
        List<PasswordResetAttempt> actualAttempts = passwordResetAttemptRepository.findAllByTimestampBefore(threshold);

        // Then
        assertThat(actualAttempts).isEmpty();
    }

    @Test
    @DisplayName("Should return all password reset attempts that exist with the timestamp before the given threshold")
    void findAllByTimestampBeforeWhenTimestampBeforeTheGivenThresholdExists() {
        // Given
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;
        long threshold = currentTimeMillis - attemptWindowDurationMillis;

        List<PasswordResetAttempt> attempts = List.of(
                new PasswordResetAttempt(email, currentTimeMillis - 2 * attemptWindowDurationMillis),
                new PasswordResetAttempt(email, (long) (currentTimeMillis - 1.75 * attemptWindowDurationMillis)),
                new PasswordResetAttempt(email, (long) (currentTimeMillis - 1.5 * attemptWindowDurationMillis))
        );
        passwordResetAttemptRepository.saveAll(attempts);

        // When
        List<PasswordResetAttempt> actualAttempts = passwordResetAttemptRepository.findAllByTimestampBefore(threshold);

        // Then
        assertThat(actualAttempts).hasSize(attempts.size());
        assertThat(actualAttempts.get(0)).isEqualTo(attempts.get(0));
        assertThat(actualAttempts.get(1)).isEqualTo(attempts.get(1));
        assertThat(actualAttempts.get(2)).isEqualTo(attempts.get(2));
    }

}