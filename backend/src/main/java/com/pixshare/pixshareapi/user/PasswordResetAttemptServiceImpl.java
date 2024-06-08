package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.validation.ValidationUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@EnableScheduling
public class PasswordResetAttemptServiceImpl implements PasswordResetAttemptService {

    private final PasswordResetAttemptRepository passwordResetAttemptRepository;
    private final ValidationUtil validationUtil;
    private final int EXPIRED_ATTEMPTS_CLEANUP_INTERVAL_IN_MILLIS = 21600 * 1000; // 6 hours interval

    @Value("${password-reset.attempt-window.max-attempts}")
    private int MAX_ATTEMPTS_IN_WINDOW; // Maximum number of attempts allowed in a given window
    @Value("${password-reset.attempt-window.duration-seconds}")
    private int ATTEMPT_WINDOW_DURATION_IN_SECONDS;

    public PasswordResetAttemptServiceImpl(PasswordResetAttemptRepository passwordResetAttemptRepository, ValidationUtil validationUtil) {
        this.passwordResetAttemptRepository = passwordResetAttemptRepository;
        this.validationUtil = validationUtil;
    }

    @Override
    public boolean isPasswordResetAttemptAllowed(String email, Long timestamp) {
        long attemptWindowDurationMillis = ATTEMPT_WINDOW_DURATION_IN_SECONDS * 1000L;
        long threshold = timestamp - attemptWindowDurationMillis;
        int maxAttemptsInWindow = MAX_ATTEMPTS_IN_WINDOW > 0 ? MAX_ATTEMPTS_IN_WINDOW : 3;
        long attemptsCount = passwordResetAttemptRepository.countByEmailAndTimestampAfter(email, threshold);

        // Check if allowed attempts within the window has been exceeded or not
        boolean isAllowed = attemptsCount < maxAttemptsInWindow;

        return isAllowed;
    }

    @Override
    public boolean isPasswordResetAttemptSuccessful(String email, Long timestamp) {
        Optional<PasswordResetAttempt> attempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        return attempt.map(PasswordResetAttempt::getSucceeded).orElse(false);
    }

    @Override
    public void savePasswordResetAttempt(String email, Long timestamp) {
        PasswordResetAttempt attempt = new PasswordResetAttempt(email, timestamp);

        // Validate password reset attempt
        validationUtil.performValidation(attempt);

        // Check if password reset attempt exists for the given email and timestamp
        boolean attemptExists = passwordResetAttemptRepository.existsByEmailAndTimestamp(email, timestamp);
        if (attemptExists) {
            return;
        }

        // Save password reset attempt
        passwordResetAttemptRepository.save(attempt);
    }


    public void updatePasswordResetAttemptSuccess(String email, Long timestamp, Boolean succeeded) {
        Optional<PasswordResetAttempt> passwordResetAttempt = passwordResetAttemptRepository.findByEmailAndTimestamp(email, timestamp);

        // Validate password reset attempt success status field
        validationUtil.performValidationOnField(PasswordResetAttempt.class, "succeeded", succeeded);

        // Update password reset attempt success status if it exists
        passwordResetAttempt.ifPresent(attempt -> {
            attempt.setSucceeded(succeeded);
            passwordResetAttemptRepository.save(attempt);
        });
    }

    @Override
    @Transactional
    // Schedule cleanup of expired attempts with a specific interval
    @Scheduled(fixedRate = EXPIRED_ATTEMPTS_CLEANUP_INTERVAL_IN_MILLIS)
    public void cleanupExpiredPasswordResetAttempts() {
        long currentTimeMillis = new Date().getTime();
        long attemptWindowDurationMillis = ATTEMPT_WINDOW_DURATION_IN_SECONDS > 0 ? ATTEMPT_WINDOW_DURATION_IN_SECONDS * 1000L : 3600 * 1000L;
        long threshold = currentTimeMillis - attemptWindowDurationMillis;

        // Get all expired attempts
        List<PasswordResetAttempt> expiredAttempts = passwordResetAttemptRepository.findAllByTimestampBefore(threshold);

        // Check if any expired attempts exist
        if (expiredAttempts.isEmpty()) {
            return;
        }

        System.out.println("Deleting password reset attempts before " + new Date(threshold));
        // Delete all expired attempts
        passwordResetAttemptRepository.deleteAll(expiredAttempts);
    }

}
