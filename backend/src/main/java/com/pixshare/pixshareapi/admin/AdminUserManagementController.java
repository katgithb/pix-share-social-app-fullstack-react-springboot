package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.AdminUserDTO;
import com.pixshare.pixshareapi.dto.AdminUserSummaryDTO;
import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.user.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for admin user management operations.
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserManagementController {

    private final AdminUserManagementService adminUserManagementService;

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

}