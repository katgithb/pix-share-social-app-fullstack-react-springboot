package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.dto.UserDTOMapper;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import com.pixshare.pixshareapi.story.StoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final AuthenticationService authenticationService;

    private final StoryService storyService;

    private final UserDTOMapper userDTOMapper;

    public UserController(UserService userService, AuthenticationService authenticationService, StoryService storyService, UserDTOMapper userDTOMapper) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.storyService = storyService;
        this.userDTOMapper = userDTOMapper;
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserDTO> findUserById(
            @PathVariable("userId") Long userId) {
        UserDTO user = userService.findUserById(userId);
        user.setStories(
                storyService.findStoriesByUserId(userId)
        );

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> findUserByUsername(
            @PathVariable("username") String username) {
        UserDTO user = userService.findUserByUsername(username);
        user.setStories(
                storyService.findStoriesByUserId(user.getId())
        );

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/m/{userIds}")
    public ResponseEntity<List<UserDTO>> findUserByIds(
            @PathVariable("userIds") List<Long> userIds) {
        List<UserDTO> users = userService.findUserByIds(userIds).stream()
                .peek(userDTO -> userDTO.setStories(
                        storyService.findStoriesByUserId(userDTO.getId())
                ))
                .toList();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/account/profile")
    public ResponseEntity<UserDTO> findUserProfile(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        UserDTO user = userService.findUserById(identity.getId());

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // /search?q=query
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUser(
            @RequestParam("q") String query) {
        List<UserDTO> users = userService.searchUser(query).stream()
                .peek(userDTO -> userDTO.setStories(
                        storyService.findStoriesByUserId(userDTO.getId())
                ))
                .toList();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<UserDTO>> findPopularUsers(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        List<UserDTO> users = userService.findPopularUsers(identity.getId()).stream()
                .peek(userDTO -> userDTO.setStories(
                        storyService.findStoriesByUserId(userDTO.getId())
                ))
                .toList();
        ;

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(
            @PathVariable("userId") Long userId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        String message = userService.followUser(identity.getId(), userId);

        return ResponseEntity.ok(message);
    }

    @PutMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(
            @PathVariable("userId") Long userId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        String message = userService.unfollowUser(identity.getId(), userId);

        return ResponseEntity.ok(message);
    }

    @PutMapping("/account/edit")
    public void updateUser(
            @RequestBody UserUpdateRequest updateRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        userService.updateUser(identity.getId(), updateRequest);
    }

    @DeleteMapping("/account/delete")
    public void deleteUser(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        userService.deleteUser(identity.getId());
    }

}
