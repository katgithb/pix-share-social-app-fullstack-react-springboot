package com.pixshare.pixshareapi.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    private final UserDTOMapper userDTOMapper;

    public UserController(UserService userService, UserDTOMapper userDTOMapper) {
        this.userService = userService;
        this.userDTOMapper = userDTOMapper;
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<UserDTO> findUserById(
            @PathVariable("userId") Long userId) {
        User user = userService.findUserById(userId);
        UserDTO userDTO = userDTOMapper.apply(user);

        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> findUserByUsername(
            @PathVariable("username") String username) {
        User user = userService.findUserByUsername(username);
        UserDTO userDTO = userDTOMapper.apply(user);

        return new ResponseEntity<>(userDTO, HttpStatus.OK);
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
        List<User> users = userService.findUserByIds(userIds);
        List<UserDTO> userDTOS = users.stream()
                .map(userDTOMapper).toList();

        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    // /search?q=query
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUser(
            @RequestParam("q") String query) {
        List<User> users = userService.searchUser(query);
        List<UserDTO> userDTOS = users.stream()
                .map(userDTOMapper).toList();

        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

}
