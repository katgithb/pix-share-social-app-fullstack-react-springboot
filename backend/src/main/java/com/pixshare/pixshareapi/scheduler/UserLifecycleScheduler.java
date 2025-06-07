package com.pixshare.pixshareapi.scheduler;

import com.pixshare.pixshareapi.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Scheduler responsible for managing user account lifecycle based on activity.
 * Implements the soft expiration and deletion policy with the following flow:
 * ACTIVE → INACTIVE → EXPIRED
 */
@Service
@RequiredArgsConstructor
@EnableScheduling
public class UserLifecycleScheduler {

    private static final int INACTIVE_THRESHOLD_DAYS = 180;
    private static final int EXPIRY_THRESHOLD_DAYS = 60;

    private final UserRepository userRepository;
    private final UserService userService;

    /**
     * Scheduled task that runs daily to check for inactive users.
     * Users who haven't logged in for a specific number of days are marked as INACTIVE.
     */
    @Scheduled(cron = "0 0 0 * * ?") // Runs at midnight every day
    @Transactional
    public void markInactiveUsers() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime inactiveThreshold = now.minusDays(INACTIVE_THRESHOLD_DAYS);

        List<User> usersToMarkInactive = userRepository.findInactiveCandidatesExcludingRole(
                inactiveThreshold, RoleName.ADMIN.name());

        if (!usersToMarkInactive.isEmpty()) {
            System.out.printf("Marking %d users as INACTIVE due to inactivity\n", usersToMarkInactive.size());

            usersToMarkInactive.forEach(user -> user.updateStatus(UserStatus.INACTIVE));
            userRepository.saveAll(usersToMarkInactive);

            System.out.printf("Successfully marked %d users as INACTIVE\n", usersToMarkInactive.size());
        }
    }

    /**
     * Scheduled task that runs daily to check for expired inactive users.
     * Users who have been in INACTIVE state for a specific number of days are marked as EXPIRED
     * and their data is partially deleted.
     */
    // @Scheduled(cron = "0 30 0 * * ?") // Runs at 00:30 every day
    @Transactional
    public void markExpiredUsers() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expiryThreshold = now.minusDays(EXPIRY_THRESHOLD_DAYS);

        List<User> usersToMarkExpired = userRepository.findExpiredCandidatesExcludingRole(
                expiryThreshold, RoleName.ADMIN.name());

        if (!usersToMarkExpired.isEmpty()) {
            System.out.printf("Processing %d users for EXPIRY\n", usersToMarkExpired.size());

            usersToMarkExpired.forEach(this::processUserExpiry);

            System.out.printf("Successfully processed %d users for EXPIRY\n", usersToMarkExpired.size());
        }
    }

    /**
     * Process a user's expiry by:
     * 1. Deleting their posts and associated data
     * 2. Removing their profile image
     * 3. Clearing personal information
     * 4. Marking them as EXPIRED
     */
    private void processUserExpiry(User user) {
        Long userId = user.getId();
        System.out.printf("Processing expiry for user ID: %d\n", userId);

        // Delete user's data
        userService.cleanupExpiredUserData(userId);

        // Clear personal information
        user.setMobile("");
        user.setWebsite("");
        user.setBio("");

        // Set timestamps to null
        user.setLastLoginAt(null);

        // Update status to EXPIRED
        user.updateStatus(UserStatus.EXPIRED);

        // Save the updated user
        userRepository.save(user);

        System.out.printf("Successfully processed expiry for user ID: %d\n", userId);
    }

}