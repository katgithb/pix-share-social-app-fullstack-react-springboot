package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stories")
public class StoryController {

    private final StoryService storyService;

    private final UserService userService;

    public StoryController(StoryService storyService, UserService userService) {
        this.storyService = storyService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public void createStory(@RequestBody Story story) {
        UserDTO user = userService.findUserByUsername("taylor");
        storyService.createStory(story, user.getId());
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<StoryDTO>> findStoriesByUserId(@PathVariable("userId") Long userId) {
        List<StoryDTO> stories = storyService.findStoriesByUserId(userId);

        return new ResponseEntity<>(stories, HttpStatus.OK);
    }
}
