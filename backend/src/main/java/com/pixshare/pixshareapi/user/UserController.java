package com.pixshare.pixshareapi.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserDTO> findUserById(
            @PathVariable("userId") Long userId) {
        UserDTO user = userService.findUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> findUserByUsername(
            @PathVariable("username") String username) {
        UserDTO user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/account/edit")
    public void updateUser(
            @RequestBody UserUpdateRequest updateRequest) {
        userService.updateUser(updateRequest.id(), updateRequest);
    }

    @DeleteMapping("/id/{userId}")
    public void deleteUserById(@PathVariable("userId") Long userId) {
        userService.deleteUserById(userId);
    }

    @GetMapping("/m/{userIds}")
    public ResponseEntity<List<UserDTO>> findUserByIds(
            @PathVariable("userIds") List<Long> userIds) {
        List<UserDTO> users = userService.findUserByIds(userIds);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // /search?q=query
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUser(
            @RequestParam("q") String query) {
        List<UserDTO> users = userService.searchUser(query);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
