package com.pixshare.pixshareapi.admin;

import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserManagementServiceImpl implements AdminUserManagementService {

    private final UserRepository userRepository;

    private final AdminUserSummaryDTOMapper adminUserSummaryDTOMapper;

    private final AdminUserDTOMapper adminUserDTOMapper;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminUserSummaryDTO> getAllUsers(PageRequestDTO pageRequest) {
        Pageable pageable = pageRequest.toPageable();
        Page<User> userPage = userRepository.findAllByRole_RoleNameNot(RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromUserPage(userPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminUserSummaryDTO> filterUsersByStatus(String status, PageRequestDTO pageRequest) {
        Pageable pageable = pageRequest.toPageable();
        UserStatus userStatus = UserStatus.from(status);

        Page<User> userPage = userRepository.findAllByStatusAndRole_RoleNameNot(userStatus,
                RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromUserPage(userPage);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AdminUserSummaryDTO> searchUser(String query, PageRequestDTO pageRequest) {
        String searchQuery = query.toLowerCase();

        Pageable pageable = pageRequest.toPageable();
        Page<User> userPage = userRepository.searchUserAndRole_RoleNameNot(searchQuery,
                RoleName.ADMIN.name(), pageable);

        return createPagedResponseFromUserPage(userPage);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDTO getUserById(Long userId) throws ResourceNotFoundException {

        return userRepository.findById(userId)
                .map(adminUserDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));
    }

    @Override
    @Transactional
    public MessageResponse updateUserStatus(Long userId, String status) throws ResourceNotFoundException, UnauthorizedActionException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        String roleName = user.getRole().getRoleName();
        UserStatus userStatus = UserStatus.from(status);

        // Check if the user is an ADMIN user
        if (RoleName.ADMIN.matches(roleName)) {
            throw new UnauthorizedActionException("You can't change the account status of an ADMIN user");
        }

        if (userStatus == UserStatus.ACTIVE) {
            user.setLastLoginAt(OffsetDateTime.now());
        }

        // Update the user status
        user.updateStatus(userStatus);
        userRepository.save(user);

        return new MessageResponse("User status updated successfully to " + status);
    }

    /**
     * Helper method to create a paged response from a page of users.
     */
    private PagedResponse<AdminUserSummaryDTO> createPagedResponseFromUserPage(Page<User> userPage) {
        // Get users content from Page
        List<AdminUserSummaryDTO> content = userPage.getContent().stream()
                .map(adminUserSummaryDTOMapper)
                .toList();

        return new PagedResponse<>(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast());
    }

}