package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stories")
public class StoryController {

    private final StoryService storyService;

    private final AuthenticationService authenticationService;

    public StoryController(StoryService storyService, AuthenticationService authenticationService) {
        this.storyService = storyService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/create")
    public void createStory(@RequestBody StoryRequest request, @RequestHeader("Authorization") String authHeader) {
        UserTokenIdentity identity = authenticationService
                .getUserIdentityFromToken(authHeader);
        storyService.createStory(request, identity.getId());
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<StoryDTO>> findStoriesByUserId(@PathVariable("userId") Long userId) {
        List<StoryDTO> stories = storyService.findStoriesByUserId(userId);

        return new ResponseEntity<>(stories, HttpStatus.OK);
    }
}
