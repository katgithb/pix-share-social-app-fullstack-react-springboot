package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    private final UserService userService;

    private final UserRepository userRepository;

    public StoryServiceImpl(StoryRepository storyRepository, UserService userService, UserRepository userRepository) {
        this.storyRepository = storyRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    public void createStory(Story story, Long userId) throws ResourceNotFoundException {
        User user = userService.findUserById(userId);

        story.setUser(user);
        story.setTimestamp(LocalDateTime.now());
        Story createdStory = storyRepository.save(story);

        user.getStories().add(createdStory);
        userRepository.save(user);
    }

    @Override
    public List<Story> findStoriesByUserId(Long userId) throws ResourceNotFoundException {
        List<Story> stories = storyRepository.findStoriesByUserId(userId,
                Sort.by(Sort.Direction.DESC, "timestamp"));

        return stories;
    }

}
