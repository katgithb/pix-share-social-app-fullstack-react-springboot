package com.pixshare.pixshareapi.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ReactivationRequestRepository extends JpaRepository<ReactivationRequest, Long>, JpaSpecificationExecutor<ReactivationRequest> {

    Page<ReactivationRequest> findAllByUser_Role_RoleNameNot(String roleName, Pageable pageable);

    Page<ReactivationRequest> findAllByStatusAndUser_Role_RoleNameNot(ReactivationRequestStatus status, String roleName, Pageable pageable);

    Boolean existsByEmail(String email);

    /**
     * Find reactivation requests that are older than the specified threshold date.
     * This is used to identify old requests that should be cleaned up.
     */
    List<ReactivationRequest> findByRequestedAtBefore(OffsetDateTime thresholdDate);

    /**
     * Find reactivation requests with a specific status that are older than the specified threshold date.
     * This allows for more targeted cleanup based on status.
     */
    List<ReactivationRequest> findByStatusAndRequestedAtBefore(ReactivationRequestStatus status, OffsetDateTime thresholdDate);

    /**
     * Find reactivation requests that have been reviewed and are older than the specified threshold date.
     * This targets requests that have already been processed and can be safely removed.
     */
    @Query("SELECT r FROM ReactivationRequest r WHERE r.reviewedAt IS NOT NULL AND r.reviewedAt < :thresholdDate")
    List<ReactivationRequest> findReviewedRequestsOlderThan(@Param("thresholdDate") OffsetDateTime thresholdDate);
    
}