package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface UserService {

    public boolean existsUserWithId(Long userId);

    public boolean existsUserWithEmail(String email);

    public void registerUser(UserRegistrationRequest registrationRequest) throws ResourceNotFoundException;

    public void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException;

    public void deleteUserById(Long userId) throws ResourceNotFoundException;

    public UserDTO findUserById(Long userId) throws ResourceNotFoundException;

    public UserDTO findUserByUsername(String username) throws ResourceNotFoundException;

    public UserDTO findUserProfile(String token) throws ResourceNotFoundException;

    public String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    public String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    public List<UserDTO> findUserByIds(List<Long> userIds) throws ResourceNotFoundException;

    public List<UserDTO> searchUser(String searchQuery) throws ResourceNotFoundException;

    public List<UserDTO> findPopularUsers(Long userId) throws ResourceNotFoundException;

}
