package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface UserService {

    boolean existsUserWithId(Long userId);

    boolean existsUserWithEmail(String email);

    void registerUser(UserRegistrationRequest registrationRequest) throws ResourceNotFoundException;

    void updateUser(Long userId, UserUpdateRequest updateRequest) throws ResourceNotFoundException;

    void deleteUserById(Long userId) throws ResourceNotFoundException;

    User findUserById(Long userId) throws ResourceNotFoundException;

    User findUserByUsername(String username) throws ResourceNotFoundException;

    User findUserProfile(String token) throws ResourceNotFoundException;

    String followUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    String unfollowUser(Long reqUserId, Long followUserId) throws ResourceNotFoundException;

    List<User> findUserByIds(List<Long> userIds) throws ResourceNotFoundException;

    List<User> searchUser(String searchQuery) throws ResourceNotFoundException;

    List<User> findPopularUsers(Long userId) throws ResourceNotFoundException;

}
