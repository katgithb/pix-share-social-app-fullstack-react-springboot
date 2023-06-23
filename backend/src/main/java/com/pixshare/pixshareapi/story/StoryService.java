package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

import java.util.List;

public interface StoryService {

    void createStory(Story story, Long userId) throws ResourceNotFoundException;

    List<Story> findStoriesByUserId(Long userId) throws ResourceNotFoundException;
    
}
