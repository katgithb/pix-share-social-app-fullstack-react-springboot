package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;
import com.pixshare.pixshareapi.exception.UnauthorizedActionException;

import java.util.List;

public interface StoryService {

    void createStory(StoryRequest storyRequest, Long userId) throws ResourceNotFoundException;

    void deleteStory(Long storyId, Long userId) throws ResourceNotFoundException, UnauthorizedActionException;

    StoryDTO findStoryById(Long storyId) throws ResourceNotFoundException;

    List<StoryDTO> findStoriesByUserId(Long userId) throws ResourceNotFoundException;

}
