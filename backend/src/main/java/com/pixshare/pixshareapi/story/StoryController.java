package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.auth.AuthenticationService;
import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.UserTokenIdentity;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stories")
@Hidden
@Tag(name = "Stories", description = "Endpoints for managing stories")
public class StoryController {

    private final StoryService storyService;

    private final AuthenticationService authenticationService;

    public StoryController(StoryService storyService, AuthenticationService authenticationService) {
        this.storyService = storyService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/create")
    public void createStory(@RequestBody StoryRequest request,
                            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);

        storyService.createStory(request, identity.getId());
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<StoryDTO>> findStoriesByUserId(@PathVariable("userId") Long userId) {
        List<StoryDTO> stories = storyService.findStoriesByUserId(userId);

        return new ResponseEntity<>(stories, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{storyId}")
    public void deleteStory(
            @PathVariable("storyId") Long storyId,
            Authentication authentication) {
        UserTokenIdentity identity = authenticationService
                .getAuthenticatedUserIdentity(authentication);
        
        storyService.deleteStory(storyId, identity.getId());
    }

}
