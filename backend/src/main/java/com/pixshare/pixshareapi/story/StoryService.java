package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.dto.StoryDTO;
import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface StoryService {

    void createStory(StoryRequest storyRequest, Long userId) throws ResourceNotFoundException;

    List<StoryDTO> findStoriesByUserId(Long userId) throws ResourceNotFoundException;

}
