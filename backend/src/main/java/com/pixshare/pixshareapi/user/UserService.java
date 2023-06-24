package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface UserService {

    boolean existsUserWithId(Long userId);

    boolean existsUserWithEmail(String email);

    void registerUser(UserRegistrationRequest registrationRequest) throws ResourceNotFoundException;

    void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException;

    void deleteUserById(Long userId) throws ResourceNotFoundException;

    UserDTO findUserById(Long userId) throws ResourceNotFoundException;

    UserDTO findUserByUsername(String username) throws ResourceNotFoundException;

    UserDTO findUserProfile(String token) throws ResourceNotFoundException;

    String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    List<UserDTO> findUserByIds(List<Long> userIds) throws ResourceNotFoundException;

    List<UserDTO> searchUser(String searchQuery) throws ResourceNotFoundException;

    List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException;

}
