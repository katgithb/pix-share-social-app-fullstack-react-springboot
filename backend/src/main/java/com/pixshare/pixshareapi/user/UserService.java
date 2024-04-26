package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.PageRequestDTO;
import com.pixshare.pixshareapi.dto.PagedResponse;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.exception.DuplicateResourceException;
import com.pixshare.pixshareapi.exception.RequestValidationException;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    boolean existsUserWithId(Long userId);

    boolean existsUserWithEmail(String email);

    boolean existsUserWithUserHandleName(String username);

    void registerUser(UserRegistrationRequest registrationRequest) throws DuplicateResourceException;

    boolean verifyPassword(Long userId, String password) throws ResourceNotFoundException;

    void updatePassword(Long userId, String newPassword) throws ResourceNotFoundException, RequestValidationException;

    void updateUserImage(Long userId, MultipartFile imageFile) throws ResourceNotFoundException, RequestValidationException;

    void removeUserImage(Long userId) throws ResourceNotFoundException;

    void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException, DuplicateResourceException, RequestValidationException;

    void deleteUser(Long userId) throws ResourceNotFoundException;

    UserDTO findUserById(Long authUserId, Long userId) throws ResourceNotFoundException;

    UserDTO findUserByEmail(Long authUserId, String email) throws ResourceNotFoundException;

    UserDTO findUserByUsername(Long authUserId, String username) throws ResourceNotFoundException;

    String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    List<UserDTO> findUserByIds(Long authUserId, List<Long> userIds) throws ResourceNotFoundException;

    PagedResponse<UserDTO> searchUser(Long userId, String searchQuery, PageRequestDTO pageRequest);

    List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException;

    List<UserDTO> findPopularUsersPublic();

}
