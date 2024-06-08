package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.validation.ValidationUtil;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
 
@ExtendWith(SpringExtension.class)
@ExtendWith(MockitoExtension.class)
@Import(ValidationUtilTestConfig.class)
public class PasswordResetAttemptServiceTest {

    private PasswordResetAttemptService passwordResetAttemptService;

    @Mock
    private PasswordResetAttemptRepository passwordResetAttemptRepository;
    @SpyBean
    private ValidationUtil validationUtil;

    @BeforeEach
    void setUp() {
        passwordResetAttemptService = new PasswordResetAttemptServiceImpl(passwordResetAttemptRepository, validationUtil);
    }

    @Test
    @DisplayName("Should return false when the number of password reset attempts is equal to the maximum allowed")
    void isPasswordResetAttemptAllowed_whenPasswordResetAttemptsCountIsEqualToMaximumAllowed_thenReturnsFalse() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        int maxAttemptsInWindow = 3;

        when(passwordResetAttemptRepository.countByEmailAndTimestampAfter(eq(email), anyLong())).thenReturn((long) maxAttemptsInWindow);

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptAllowed(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).countByEmailAndTimestampAfter(eq(email), anyLong());
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return false when the number of password reset attempts exceeds the maximum allowed")
    void isPasswordResetAttemptAllowed_whenPasswordResetAttemptsCountExceedsMaximumAllowed_thenReturnsFalse() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        int maxAttemptsInWindow = 3;
        long attemptsCount = maxAttemptsInWindow + 1;

        when(passwordResetAttemptRepository.countByEmailAndTimestampAfter(eq(email), anyLong())).thenReturn(attemptsCount);

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptAllowed(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).countByEmailAndTimestampAfter(eq(email), anyLong());
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return true when the number of password reset attempts is below the maximum allowed")
    void isPasswordResetAttemptAllowed_whenPasswordResetAttemptsCountIsBelowMaximumAllowed_thenReturnsTrue() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        int maxAttemptsInWindow = 3;
        long attemptsCount = maxAttemptsInWindow - 1;

        when(passwordResetAttemptRepository.countByEmailAndTimestampAfter(eq(email), anyLong())).thenReturn(attemptsCount);

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptAllowed(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).countByEmailAndTimestampAfter(eq(email), anyLong());
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should return false when password reset attempt does not exist for the given email and timestamp")
    void isPasswordResetAttemptSuccessful_whenPasswordResetAttemptDoesNotExist_thenReturnsFalse() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();

        when(passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp)).thenReturn(Optional.empty());

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptSuccessful(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return false when password reset attempt exists for the given email and timestamp but it's not successful yet")
    void isPasswordResetAttemptSuccessful_whenPasswordResetAttemptExistsAndIsNotSuccessfulYet_thenReturnsFalse() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);
        attempt.setSucceeded(false);

        when(passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp)).thenReturn(Optional.of(attempt));

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptSuccessful(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should return true when password reset attempt exists for the given email and timestamp and is successful")
    void isPasswordResetAttemptSuccessful_whenPasswordResetAttemptExistsAndIsSuccessful_thenReturnsTrue() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);
        attempt.setSucceeded(true);

        when(passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp)).thenReturn(Optional.of(attempt));

        // When
        boolean result = passwordResetAttemptService.isPasswordResetAttemptSuccessful(email, timestamp);

        // Then
        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when given email is invalid")
    void savePasswordResetAttempt_whenEmailIsInvalid_thenThrowException() {
        // Given
        String email = "invalidEmail";
        long timestampMillis = System.currentTimeMillis();

        // When
        // Then
        assertThatThrownBy(() -> passwordResetAttemptService.savePasswordResetAttempt(email, timestampMillis))
                .isInstanceOf(ConstraintViolationException.class);


        verify(validationUtil, times(1)).performValidation(any(PasswordResetAttempt.class));
        verify(passwordResetAttemptRepository, times(0)).existsByEmailAndTimestamp(email, timestampMillis);
        verify(passwordResetAttemptRepository, times(0)).save(any(PasswordResetAttempt.class));
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when given timestamp is invalid")
    void savePasswordResetAttempt_whenTimestampIsInvalid_thenThrowException() {
        // Given
        String email = "test@example.com";
        long timestampMillis = 0;

        // When
        // Then
        assertThatThrownBy(() -> passwordResetAttemptService.savePasswordResetAttempt(email, timestampMillis))
                .isInstanceOf(ConstraintViolationException.class);


        verify(validationUtil, times(1)).performValidation(any(PasswordResetAttempt.class));
        verify(passwordResetAttemptRepository, times(0)).existsByEmailAndTimestamp(email, timestampMillis);
        verify(passwordResetAttemptRepository, times(0)).save(any(PasswordResetAttempt.class));
    }

    @Test
    @DisplayName("Should not save new password reset attempt when it already exists with the same email and timestamp")
    void savePasswordResetAttempt_whenPasswordResetAttemptAlreadyExists_thenDoNotSavePasswordResetAttempt() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();

        when(passwordResetAttemptRepository.existsByEmailAndTimestamp(email, timestamp)).thenReturn(true);

        // When
        passwordResetAttemptService.savePasswordResetAttempt(email, timestamp);

        // Then
        verify(validationUtil, times(1)).performValidation(any(PasswordResetAttempt.class));
        verify(passwordResetAttemptRepository, times(1)).existsByEmailAndTimestamp(email, timestamp);
        verify(passwordResetAttemptRepository, times(0)).save(any(PasswordResetAttempt.class));
    }

    @Test
    @DisplayName("Should save a new password reset attempt when it does not already exist and the email and timestamp are valid")
    void savePasswordResetAttempt_whenPasswordResetAttemptDoesNotAlreadyExistAndEmailAndTimestampAreValid() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();

        when(passwordResetAttemptRepository.existsByEmailAndTimestamp(email, timestamp)).thenReturn(false);

        // When
        passwordResetAttemptService.savePasswordResetAttempt(email, timestamp);

        // Then
        ArgumentCaptor<PasswordResetAttempt> passwordResetAttemptCaptor = ArgumentCaptor.forClass(PasswordResetAttempt.class);
        verify(validationUtil, times(1)).performValidation(any(PasswordResetAttempt.class));
        verify(passwordResetAttemptRepository, times(1)).existsByEmailAndTimestamp(email, timestamp);
        verify(passwordResetAttemptRepository, times(1)).save(passwordResetAttemptCaptor.capture());

        PasswordResetAttempt savedPasswordResetAttempt = passwordResetAttemptCaptor.getValue();
        assertThat(savedPasswordResetAttempt.getEmail()).isEqualTo(email);
        assertThat(savedPasswordResetAttempt.getTimestamp()).isEqualTo(timestamp);
        assertThat(savedPasswordResetAttempt.getSucceeded()).isFalse();
    }

    @Test
    @DisplayName("Should throw a ConstraintViolationException when given success status is invalid")
    void updatePasswordResetAttemptSuccess_whenSuccessStatusIsInvalid_thenThrowException() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        Boolean succeeded = null;

        // When
        // Then
        assertThatThrownBy(() -> passwordResetAttemptService.updatePasswordResetAttemptSuccess(email, timestamp, succeeded))
                .isInstanceOf(ConstraintViolationException.class);

        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        verify(validationUtil, times(1)).performValidationOnField(PasswordResetAttempt.class, "succeeded", succeeded);
        verify(passwordResetAttemptRepository, times(0)).save(any(PasswordResetAttempt.class));
    }

    @Test
    @DisplayName("Should not update password reset attempt success status when attempt does not exist with the given email and timestamp")
    void updatePasswordResetAttemptSuccess_whenPasswordResetAttemptDoesNotExist_thenDoNotUpdateSuccessStatus() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        Boolean succeeded = true;

        when(passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp)).thenReturn(Optional.empty());

        // When
        passwordResetAttemptService.updatePasswordResetAttemptSuccess(email, timestamp, succeeded);

        // Then
        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        verify(validationUtil, times(1)).performValidationOnField(PasswordResetAttempt.class, "succeeded", succeeded);
        verify(passwordResetAttemptRepository, times(0)).save(any(PasswordResetAttempt.class));
    }

    @Test
    @DisplayName("Should update password reset attempt success status when attempt exists and the success status is valid")
    void updatePasswordResetAttemptSuccess_whenPasswordResetAttemptExistsAndSuccessStatusIsValid() {
        // Given
        String email = "test@example.com";
        long timestamp = System.currentTimeMillis();
        Boolean succeeded = true;
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);

        when(passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp)).thenReturn(Optional.of(attempt));

        // When
        passwordResetAttemptService.updatePasswordResetAttemptSuccess(email, timestamp, succeeded);

        // Then
        ArgumentCaptor<PasswordResetAttempt> passwordResetAttemptCaptor = ArgumentCaptor.forClass(PasswordResetAttempt.class);
        verify(passwordResetAttemptRepository, times(1)).findByEmailAndTimestamp(email, timestamp);
        verify(validationUtil, times(1)).performValidationOnField(PasswordResetAttempt.class, "succeeded", succeeded);
        verify(passwordResetAttemptRepository, times(1)).save(passwordResetAttemptCaptor.capture());

        PasswordResetAttempt savedPasswordResetAttempt = passwordResetAttemptCaptor.getValue();
        assertThat(savedPasswordResetAttempt.getSucceeded()).isEqualTo(succeeded);
    }

    @Test
    @DisplayName("Should not clear password reset attempts when no password reset attempts exist")
    void cleanupExpiredPasswordResetAttempts_whenNoPasswordResetAttemptsExist_thenDoNotClearAttempts() {
        // Given
        when(passwordResetAttemptRepository.findAllByTimestampBefore(anyLong())).thenReturn(Collections.emptyList());

        // When
        passwordResetAttemptService.cleanupExpiredPasswordResetAttempts();

        // Then
        verify(passwordResetAttemptRepository, times(1)).findAllByTimestampBefore(anyLong());
        verify(passwordResetAttemptRepository, times(0)).deleteAll(anyList());
    }

    @Test
    @DisplayName("Should not clear password reset attempts when password reset attempts are not expired")
    void cleanupExpiredPasswordResetAttempts_whenPasswordResetAttemptsAreNotExpired_thenDoNotClearAttempts() {
        // Given
        String email = "test@example.com";
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;

        List<PasswordResetAttempt> nonExpiredPasswordResetAttempts = List.of(
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 2),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 3),
                new PasswordResetAttempt(email, currentTimeMillis - attemptWindowDurationMillis / 4)
        );

        when(passwordResetAttemptRepository.findAllByTimestampBefore(anyLong())).thenReturn(Collections.emptyList());

        // When
        passwordResetAttemptService.cleanupExpiredPasswordResetAttempts();

        // Then
        verify(passwordResetAttemptRepository, times(1)).findAllByTimestampBefore(anyLong());
        verify(passwordResetAttemptRepository, times(0)).deleteAll(nonExpiredPasswordResetAttempts);
    }

    @Test
    @DisplayName("Should clear password reset attempts when password reset attempts have expired being older than the threshold")
    void cleanupExpiredPasswordResetAttempts_whenPasswordResetAttemptsHaveExpired() {
        // Given
        String email = "test@example.com";
        long currentTimeMillis = System.currentTimeMillis();
        long attemptWindowDurationMillis = 3600 * 1000L;

        List<PasswordResetAttempt> expiredPasswordResetAttempts = List.of(
                new PasswordResetAttempt(email, currentTimeMillis - 2 * attemptWindowDurationMillis),
                new PasswordResetAttempt(email, (long) (currentTimeMillis - 1.75 * attemptWindowDurationMillis)),
                new PasswordResetAttempt(email, (long) (currentTimeMillis - 1.5 * attemptWindowDurationMillis))
        );

        when(passwordResetAttemptRepository.findAllByTimestampBefore(anyLong())).thenReturn(expiredPasswordResetAttempts);

        // When
        passwordResetAttemptService.cleanupExpiredPasswordResetAttempts();

        // Then
        ArgumentCaptor<List<PasswordResetAttempt>> attemptsCaptor = ArgumentCaptor.forClass(List.class);
        verify(passwordResetAttemptRepository, times(1)).findAllByTimestampBefore(anyLong());
        verify(passwordResetAttemptRepository, times(1)).deleteAll(attemptsCaptor.capture());

        List<PasswordResetAttempt> deletedAttempts = attemptsCaptor.getValue();
        assertThat(deletedAttempts).hasSize(expiredPasswordResetAttempts.size());
        assertThat(deletedAttempts.get(0)).isEqualTo(expiredPasswordResetAttempts.get(0));
        assertThat(deletedAttempts.get(1)).isEqualTo(expiredPasswordResetAttempts.get(1));
        assertThat(deletedAttempts.get(2)).isEqualTo(expiredPasswordResetAttempts.get(2));
    }

}
