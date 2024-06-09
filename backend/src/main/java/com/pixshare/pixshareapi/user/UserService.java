package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserSummaryDTO;
import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.TokenValidationException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    boolean existsUserWithId(Long userId);

    boolean existsUserWithEmail(String email);

    boolean existsUserWithUserHandleName(String username);

    void registerUser(UserRegistrationRequest registrationRequest) throws DuplicateResourceException;

    boolean verifyPassword(Long userId, String password) throws ResourceNotFoundException;

    void updatePassword(Long userId, String newPassword) throws ResourceNotFoundException, RequestValidationException;

    void initiatePasswordReset(String email) throws RequestValidationException;

    boolean validatePasswordResetToken(String token) throws TokenValidationException;

    void resetPassword(String token, String newPassword) throws TokenValidationException;

    void updateUserImage(Long userId, MultipartFile imageFile) throws ResourceNotFoundException, RequestValidationException;

    void removeUserImage(Long userId) throws ResourceNotFoundException;

    void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException, DuplicateResourceException, RequestValidationException;

    void deleteUser(Long userId) throws ResourceNotFoundException;

    UserSummaryDTO findUserById(Long authUserId, Long userId) throws ResourceNotFoundException;

    UserSummaryDTO findUserByEmail(Long authUserId, String email) throws ResourceNotFoundException;

    UserSummaryDTO findUserByUsername(Long authUserId, String username) throws ResourceNotFoundException;

    UserDTO findUserProfile(Long authUserId) throws ResourceNotFoundException;

    String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    List<UserSummaryDTO> findUserByIds(Long authUserId, List<Long> userIds) throws ResourceNotFoundException;

    PagedResponse<UserSummaryDTO> searchUser(Long userId, String searchQuery, PageRequestDTO pageRequest);

    List<UserSummaryDTO> findPopularUsers(Long userId) throws ResourceNotFoundException;

    List<UserSummaryDTO> findPopularUsersPublic();

}
