package com.pixshare.pixshareapi.user;

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

    UserDTO findUserById(Long userId) throws ResourceNotFoundException;

    UserDTO findUserByEmail(String email) throws ResourceNotFoundException;

    UserDTO findUserByUsername(String username) throws ResourceNotFoundException;

    String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException, RequestValidationException;

    List<UserDTO> findUserByIds(List<Long> userIds) throws ResourceNotFoundException;

    List<UserDTO> searchUser(String searchQuery) throws ResourceNotFoundException;

    List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException;

}
