package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.dto.StoryDTOMapper;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;
import com.pixshare.pixshareapi.upload.UploadService;
import com.pixshare.pixshareapi.user.RoleName;
import com.pixshare.pixshareapi.user.User;
import com.pixshare.pixshareapi.user.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    private final UploadService uploadService;

    private final UserRepository userRepository;

    private final StoryDTOMapper storyDTOMapper;

    public StoryServiceImpl(StoryRepository storyRepository, UploadService uploadService, UserRepository userRepository, StoryDTOMapper storyDTOMapper) {
        this.storyRepository = storyRepository;
        this.uploadService = uploadService;
        this.userRepository = userRepository;
        this.storyDTOMapper = storyDTOMapper;
    }

    @Override
    public void createStory(StoryRequest storyRequest, Long userId) throws ResourceNotFoundException {
        User user = userRepository.findByIdAndRole_RoleName(userId, RoleName.USER.name())
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        Story story = new Story(
                storyRequest.image(),
                storyRequest.image(),
                storyRequest.caption(),
                ZonedDateTime.now(),
                user);

        storyRepository.save(story);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteStory(Long storyId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story with id [%s] not found".formatted(storyId)));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id [%s] not found".formatted(userId)));

        if (!story.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can't delete other user's story");
        }

        removeStoryImageResource(story.getImageUploadId());
        storyRepository.deleteById(story.getId());
    }

    @Override
    public StoryDTO findStoryById(Long storyId) throws ResourceNotFoundException {
        StoryDTO story = storyRepository.findByIdAndUser_Role(storyId, RoleName.USER.name())
                .map(storyDTOMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Story with id [%s] not found".formatted(storyId)));


        return story;
    }

    @Override
    public List<StoryDTO> findStoriesByUserId(Long userId) throws ResourceNotFoundException {
        List<StoryDTO> stories = storyRepository.findAllStoriesByUserIdAndUser_Role(
                        userId, RoleName.USER.name(), Sort.by(Sort.Direction.DESC, "timestamp"))
                .stream()
                .map(storyDTOMapper)
                .toList();

        return stories;
    }

    private void removeStoryImageResource(String storyImageUploadId) {
        if (storyImageUploadId != null && !storyImageUploadId.isBlank()) {
            // Delete story image resource from cloudinary
            uploadService.deleteCloudinaryImageResourceByPublicId(storyImageUploadId, true);
        }
    }

}
