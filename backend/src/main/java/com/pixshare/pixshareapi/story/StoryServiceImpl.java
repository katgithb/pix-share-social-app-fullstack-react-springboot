package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.StoryDTOMapper;
import com.pixshare.pixshareapi.dto.UserDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import com.pixshare.pixshareapi.user.UserService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    private final UserService userService;

    private final UserRepository userRepository;

    private final StoryDTOMapper storyDTOMapper;

    public StoryServiceImpl(StoryRepository storyRepository, UserService userService, UserRepository userRepository, StoryDTOMapper storyDTOMapper) {
        this.storyRepository = storyRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.storyDTOMapper = storyDTOMapper;
    }

    @Override
    public void createStory(StoryRequest storyRequest, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        Story story = new Story(
                storyRequest.image(),
                storyRequest.caption(),
                LocalDateTime.now(),
                user);

        storyRepository.save(story);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteStory(Long storyId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException {
        StoryDTO story = findStoryById(storyId);
        UserDTO user = userService.findUserById(userId);

        if (!story.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's story");
        }

        storyRepository.deleteById(story.getId());
    }

    @Override
    public StoryDTO findStoryById(Long storyId) throws ResourceNotFoundException {
        StoryDTO story = storyRepository.findById(storyId)
                .map(storyDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Story with id [%s] not found".formatted(storyId)));


        return story;
    }

    @Override
    public List<StoryDTO> findStoriesByUserId(Long userId) throws ResourceNotFoundException {
        List<StoryDTO> stories = storyRepository.findStoriesByUserId(userId,
                        Sort.by(Sort.Direction.DESC, "timestamp"))
                .stream()
                .map(storyDTOMapper)
                .toList();

        return stories;
    }

}
