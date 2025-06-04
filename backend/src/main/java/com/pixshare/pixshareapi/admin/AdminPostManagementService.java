package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.AdminPostDTO;
import com.pixshare.pixshareapi.dto.AdminPostSummaryDTO;
import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.user.MessageResponse;

import java.time.LocalDate;

public interface AdminPostManagementService {

    PagedResponse<AdminPostSummaryDTO> getAllPosts(PageRequestDTO pageRequest);

    PagedResponse<AdminPostSummaryDTO> getAllPostsByUserId(Long userId, PageRequestDTO pageRequest);

    PagedResponse<AdminPostSummaryDTO> filterPostsByDateRange(
            LocalDate startDate,
            LocalDate endDate,
            PageRequestDTO pageRequest);

    PagedResponse<AdminPostSummaryDTO> searchPosts(String query, PageRequestDTO pageRequest);

    AdminPostDTO getPostById(Long postId) throws ResourceNotFoundException;

    MessageResponse deletePost(Long postId) throws ResourceNotFoundException;

}