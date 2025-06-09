package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.AdminPostDTO;
import com.pixshare.pixshareapi.dto.AdminPostSummaryDTO;
import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.user.MessageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * REST controller for admin post management operations.
 */
@RestController
@RequestMapping("/api/v1/admin/posts")
@Tag(name = "Admin Post Management", description = "Endpoints for post management by admin")
@RequiredArgsConstructor
public class AdminPostManagementController {

    private final AdminPostManagementService adminPostManagementService;

    /**
     * Lists all posts with pagination.
     */
    @GetMapping("/all")
    public ResponseEntity<PagedResponse<AdminPostSummaryDTO>> getAllPosts(
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminPostSummaryDTO> postResponse = adminPostManagementService.getAllPosts(pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    /**
     * Gets all posts by a specific user.
     */
    @GetMapping("/all/{userId}")
    public ResponseEntity<PagedResponse<AdminPostSummaryDTO>> getAllPostsByUser(
            @PathVariable("userId") Long userId,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminPostSummaryDTO> postResponse = adminPostManagementService.getAllPostsByUserId(userId, pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    /**
     * Filters posts by date range with pagination.
     */
    @GetMapping("/filter")
    public ResponseEntity<PagedResponse<AdminPostSummaryDTO>> filterPosts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminPostSummaryDTO> postResponse = adminPostManagementService.filterPostsByDateRange(
                startDate, endDate, pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    /**
     * Searches posts by caption/location with pagination.
     */
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<AdminPostSummaryDTO>> searchPosts(
            @RequestParam("q") String query,
            @ModelAttribute PageRequestDTO pageRequest) {

        PagedResponse<AdminPostSummaryDTO> postResponse = adminPostManagementService.searchPosts(query, pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    /**
     * Get specific post details by ID.
     */
    @GetMapping("/id/{postId}")
    public ResponseEntity<AdminPostDTO> getPostById(
            @PathVariable("postId") Long postId) {

        AdminPostDTO post = adminPostManagementService.getPostById(postId);

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    /**
     * Deletes a post (hard delete).
     */
    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<MessageResponse> deletePost(
            @PathVariable("postId") Long postId) {

        MessageResponse response = adminPostManagementService.deletePost(postId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}