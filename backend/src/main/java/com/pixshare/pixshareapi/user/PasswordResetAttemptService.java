package com.pixshare.pixshareapi.user;

public interface PasswordResetAttemptService {

    boolean isPasswordResetAttemptAllowed(String email, Long timestamp);

    boolean isPasswordResetAttemptSuccessful(String email, Long timestamp);

    void savePasswordResetAttempt(String email, Long timestamp);

    void updatePasswordResetAttemptSuccess(String email, Long timestamp, Boolean succeeded);

    void cleanupExpiredPasswordResetAttempts();

}
