package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.*;
import com.pixshare.pixshareapi.post.PostService;
import com.pixshare.pixshareapi.story.StoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final PostService postService;

    private final AuthenticationService authenticationService;

    private final StoryService storyService;

    private final ReactivationService reactivationService;

    public UserController(UserService userService, PostService postService, AuthenticationService authenticationService, StoryService storyService, ReactivationService reactivationService) {
        this.userService = userService;
        this.postService = postService;
        this.authenticationService = authenticationService;
        this.storyService = storyService;
        this.reactivationService = reactivationService;
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserSummaryDTO> findUserById(
            @PathVariable("userId") Long userId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        UserSummaryDTO user = userService.findUserById(identity.getId(), userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserSummaryDTO> findUserByUsername(
            @PathVariable("username") String username,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        UserSummaryDTO user = userService.findUserByUsername(identity.getId(), username);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/m/{userIds}")
    public ResponseEntity<List<UserSummaryDTO>> findUserByIds(
            @PathVariable("userIds") List<Long> userIds,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        List<UserSummaryDTO> users = userService.findUserByIds(identity.getId(), userIds);

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // /search?q=query
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<UserSummaryDTO>> searchUser(
            @RequestParam("q") String query,
            @ModelAttribute PageRequestDTO pageRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PagedResponse<UserSummaryDTO> userResponse = userService.searchUser(identity.getId(), query, pageRequest);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<UserSummaryDTO>> findPopularUsers(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        List<UserSummaryDTO> users = userService.findPopularUsers(identity.getId());

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/public/popular")
    public ResponseEntity<List<UserSummaryDTO>> findPopularUsersPublic() {
        List<UserSummaryDTO> users = userService.findPopularUsersPublic();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/follow/{userId}")
    public ResponseEntity<MessageResponse> followUser(
            @PathVariable("userId") Long userId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        String message = userService.followUser(identity.getId(), userId);
        MessageResponse response = new MessageResponse(message);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/unfollow/{userId}")
    public ResponseEntity<MessageResponse> unfollowUser(
            @PathVariable("userId") Long userId,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        String message = userService.unfollowUser(identity.getId(), userId);
        MessageResponse response = new MessageResponse(message);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/account/profile")
    public ResponseEntity<UserDTO> findUserProfile(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        UserDTO user = userService.findUserProfile(identity.getId());

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/account/saved")
    public ResponseEntity<PagedResponse<PostDTO>> findSavedPostsByUserId(
            @RequestHeader("Authorization") String authHeader,
            @ModelAttribute PageRequestDTO pageRequest) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        PagedResponse<PostDTO> postResponse = postService.findSavedPostsByUserId(identity.getId(), pageRequest);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @PostMapping("/account/password/verify")
    public ResponseEntity<Boolean> verifyPassword(
            @RequestBody UserPasswordRequest passwordRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        boolean passwordsMatch = userService.verifyPassword(identity.getId(), passwordRequest.currPassword());

        return new ResponseEntity<>(passwordsMatch, HttpStatus.OK);
    }

    @PutMapping("/account/password/update")
    public void updatePassword(
            @RequestBody UserPasswordRequest passwordRequest,
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);

        userService.updatePassword(identity.getId(), passwordRequest.newPassword());
    }

    @PostMapping("/account/password/reset/request")
    public void initiatePasswordReset(
            @RequestBody UserPasswordResetRequest passwordResetRequest) {

        userService.initiatePasswordReset(passwordResetRequest.email());
    }

    @GetMapping("/account/password/reset/validate/{token}")
    public ResponseEntity<Boolean> validatePasswordResetToken(
            @PathVariable("token") String token) {
        boolean isPasswordResetTokenValid = userService.validatePasswordResetToken(token);

        return new ResponseEntity<>(isPasswordResetTokenValid, HttpStatus.OK);
    }

    @PutMapping("/account/password/reset")
    public void resetPassword(
            @RequestBody UserPasswordResetRequest passwordResetRequest) {

        userService.resetPassword(passwordResetRequest.token(), passwordResetRequest.newPassword());
    }

    @PostMapping("/account/reactivation/request")
    public ResponseEntity<MessageResponse> requestAccountReactivation(
            @RequestBody UserReactivationRequest reactivationRequest) {
        MessageResponse response = reactivationService.createReactivationRequest(reactivationRequest.email());
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/account/profile/image/update")
    public void updateUserImage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("image") MultipartFile imageFile
    ) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        userService.updateUserImage(identity.getId(), imageFile);
    }

    @DeleteMapping("/account/profile/image/delete")
    public void removeUserImage(
            @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        userService.removeUserImage(identity.getId());
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
