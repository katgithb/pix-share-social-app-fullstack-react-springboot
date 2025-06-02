package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.AdminUserDTO;
import com.pixshare.pixshareapi.dto.AdminUserSummaryDTO;
import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.user.MessageResponse;

public interface AdminUserManagementService {

    PagedResponse<AdminUserSummaryDTO> getAllUsers(PageRequestDTO pageRequest);

    PagedResponse<AdminUserSummaryDTO> filterUsersByStatus(String status, PageRequestDTO pageRequest);

    PagedResponse<AdminUserSummaryDTO> searchUser(String query, PageRequestDTO pageRequest);

    AdminUserDTO getUserById(Long userId) throws ResourceNotFoundException;

    MessageResponse updateUserStatus(Long userId, String status) throws ResourceNotFoundException, UnauthorizedActionException;

}