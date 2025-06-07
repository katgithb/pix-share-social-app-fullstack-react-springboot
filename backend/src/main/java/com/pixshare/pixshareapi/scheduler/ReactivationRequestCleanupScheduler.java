package com.pixshare.pixshareapi.scheduler;

import com.pixshare.pixshareapi.user.ReactivationRequest;
import com.pixshare.pixshareapi.user.ReactivationRequestRepository;
import com.pixshare.pixshareapi.user.ReactivationRequestStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Scheduler responsible for cleaning up old reactivation requests.
 * Implements automatic removal of:
 * 1. Old reviewed requests (APPROVED or REJECTED) after a specified period
 * 2. Stale pending requests that have not been reviewed for an extended period
 */
@Service
@RequiredArgsConstructor
@EnableScheduling
public class ReactivationRequestCleanupScheduler {

    // Threshold for cleaning up reviewed requests (APPROVED or REJECTED)
    private static final int REVIEWED_REQUESTS_CLEANUP_DAYS = 7;

    // Threshold for cleaning up stale pending requests
    private static final int STALE_PENDING_REQUESTS_CLEANUP_DAYS = 15;

    private final ReactivationRequestRepository reactivationRequestRepository;

    /**
     * Scheduled task that runs daily to clean up old reviewed reactivation requests.
     * Removes APPROVED and REJECTED requests that are older than the specified threshold.
     */
    @Scheduled(cron = "0 0 1 * * ?") // Runs at 1:00 AM every day
    @Transactional
    public void cleanupReviewedRequests() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime cleanupThreshold = now.minusDays(REVIEWED_REQUESTS_CLEANUP_DAYS);

        List<ReactivationRequest> oldReviewedRequests = reactivationRequestRepository.findReviewedRequestsOlderThan(cleanupThreshold);

        if (!oldReviewedRequests.isEmpty()) {
            System.out.printf("Cleaning up %d old reviewed reactivation requests\n", oldReviewedRequests.size());

            reactivationRequestRepository.deleteAll(oldReviewedRequests);

            System.out.printf("Successfully cleaned up %d old reviewed reactivation requests\n", oldReviewedRequests.size());
        }
    }

    /**
     * Scheduled task that runs weekly to clean up stale pending reactivation requests.
     * Removes PENDING requests that have not been reviewed for an extended period.
     */
    @Scheduled(cron = "0 30 1 * * 1") // Runs at 1:30 AM every Monday
    @Transactional
    public void cleanupStalePendingRequests() {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime stalePendingThreshold = now.minusDays(STALE_PENDING_REQUESTS_CLEANUP_DAYS);

        List<ReactivationRequest> stalePendingRequests = reactivationRequestRepository.findByStatusAndRequestedAtBefore(
                ReactivationRequestStatus.PENDING, stalePendingThreshold);

        if (!stalePendingRequests.isEmpty()) {
            System.out.printf("Cleaning up %d stale pending reactivation requests\n", stalePendingRequests.size());

            reactivationRequestRepository.deleteAll(stalePendingRequests);

            System.out.printf("Successfully cleaned up %d stale pending reactivation requests\n", stalePendingRequests.size());
        }
    }

    /**
     * Scheduled task that runs monthly to perform a comprehensive cleanup of all old reactivation requests.
     * This serves as a safety net to ensure no old requests remain in the system.
     */
    @Scheduled(cron = "0 0 2 1 * ?") // Runs at 2:00 AM on the 1st day of each month
    @Transactional
    public void performComprehensiveCleanup() {
        // Use a longer threshold for comprehensive cleanup
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime comprehensiveCleanupThreshold = now.minusDays(
                Math.max(REVIEWED_REQUESTS_CLEANUP_DAYS, STALE_PENDING_REQUESTS_CLEANUP_DAYS) * 2);

        List<ReactivationRequest> veryOldRequests = reactivationRequestRepository.findByRequestedAtBefore(comprehensiveCleanupThreshold);

        if (!veryOldRequests.isEmpty()) {
            System.out.printf("Performing comprehensive cleanup of %d very old reactivation requests\n", veryOldRequests.size());

            reactivationRequestRepository.deleteAll(veryOldRequests);

            System.out.printf("Successfully completed comprehensive cleanup of %d very old reactivation requests\n", veryOldRequests.size());
        }
    }

}