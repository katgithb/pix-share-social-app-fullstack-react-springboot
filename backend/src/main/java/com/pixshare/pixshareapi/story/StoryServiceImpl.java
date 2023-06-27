package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.StoryDTOMapper;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    private final UserRepository userRepository;

    private final StoryDTOMapper storyDTOMapper;

    public StoryServiceImpl(StoryRepository storyRepository, UserRepository userRepository, StoryDTOMapper storyDTOMapper) {
        this.storyRepository = storyRepository;
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
    public List<StoryDTO> findStoriesByUserId(Long userId) throws ResourceNotFoundException {
        List<StoryDTO> stories = storyRepository.findStoriesByUserId(userId,
                        Sort.by(Sort.Direction.DESC, "timestamp"))
                .stream()
                .map(storyDTOMapper)
                .toList();

        return stories;
    }

}
