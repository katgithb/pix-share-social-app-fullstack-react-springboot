package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.user.MessageResponse;
import com.pixshare.pixshareapi.user.ReactivationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for admin user management operations.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "Admin User Management", description = "Endpoints for user management by admin")
@RequiredArgsConstructor
public class AdminUserManagementController {

    private final AdminUserManagementService adminUserManagementService;

    private final ReactivationService reactivationService;

    /**
     * Lists all users with pagination.
     */
    @GetMapping("/all")
    public ResponseEntity<PagedResponse<AdminUserSummaryDTO>> getAllUsers(
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminUserSummaryDTO> userResponse = adminUserManagementService.getAllUsers(pageRequest);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    /**
     * Filters users by their account status with pagination.
     */
    @GetMapping("/filter")
    public ResponseEntity<PagedResponse<AdminUserSummaryDTO>> filterUsersByStatus(
            @RequestParam(defaultValue = "") String status,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminUserSummaryDTO> userResponse = adminUserManagementService.filterUsersByStatus(status, pageRequest);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    /**
     * Searches users by username, name, or email with pagination.
     */
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<AdminUserSummaryDTO>> searchUser(
            @RequestParam("q") String query,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminUserSummaryDTO> userResponse = adminUserManagementService.searchUser(query, pageRequest);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    /**
     * Gets specific user details by ID with admin-specific information.
     */
    @GetMapping("/id/{userId}")
    public ResponseEntity<AdminUserDTO> getUserById(
            @PathVariable("userId") Long userId) {

        AdminUserDTO user = adminUserManagementService.getUserById(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    /**
     * Updates a user's account status.
     */
    @PutMapping("/account/status/update/{userId}")
    public ResponseEntity<MessageResponse> updateUserStatus(
            @PathVariable("userId") Long userId,
            @RequestBody UserStatusUpdateRequest request) {

        MessageResponse response = adminUserManagementService.updateUserStatus(userId, request.status());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Lists all reactivation requests with pagination and optional status filtering.
     */
    @GetMapping("/account/reactivation/requests")
    public ResponseEntity<PagedResponse<ReactivationRequestDTO>> getReactivationRequests(
            @RequestParam(required = false) String status,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<ReactivationRequestDTO> reactivationResponse = reactivationService.getReactivationRequests(status, pageRequest);

        return new ResponseEntity<>(reactivationResponse, HttpStatus.OK);
    }

    /**
     * Gets a specific reactivation request by ID.
     */
    @GetMapping("/account/reactivation/requests/{requestId}")
    public ResponseEntity<ReactivationRequestDTO> getReactivationRequestById(
            @PathVariable("requestId") Long requestId) {

        ReactivationRequestDTO reactivationRequest = reactivationService.getReactivationRequestById(requestId);

        return new ResponseEntity<>(reactivationRequest, HttpStatus.OK);
    }

    /**
     * Reviews a reactivation request, approving or rejecting it.
     */
    @PutMapping("/account/reactivation/review/{requestId}")
    public ResponseEntity<MessageResponse> reviewReactivationRequest(
            @PathVariable("requestId") Long requestId,
            @RequestBody ReactivationStatusUpdateRequest request) {

        MessageResponse response = reactivationService.reviewReactivationRequest(requestId, request.status());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}