package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.user.User;
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

    private final StoryDTOMapper storyDTOMapper;

    public StoryController(StoryService storyService, UserService userService, StoryDTOMapper storyDTOMapper) {
        this.storyService = storyService;
        this.userService = userService;
        this.storyDTOMapper = storyDTOMapper;
    }

    @PostMapping("/create")
    public void createStory(@RequestBody Story story) {
        User user = userService.findUserByUsername("taylor");
        storyService.createStory(story, user.getId());
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<StoryDTO>> findStoriesByUserId(@PathVariable("userId") Long userId) {
        List<StoryDTO> stories = storyService.findStoriesByUserId(userId).stream()
                .map(storyDTOMapper)
                .toList();

        return new ResponseEntity<>(stories, HttpStatus.OK);
    }
}
