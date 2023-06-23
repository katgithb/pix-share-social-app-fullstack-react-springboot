package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.user.UserViewMapper;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class StoryDTOMapper implements Function<Story, StoryDTO> {

    private final UserViewMapper userViewMapper;

    public StoryDTOMapper(UserViewMapper userViewMapper) {
        this.userViewMapper = userViewMapper;
    }

    @Override
    public StoryDTO apply(Story story) {
        return new StoryDTO(
                story.getId(),
                story.getImage(),
                story.getCaption(),
                story.getTimestamp(),
                userViewMapper.apply(story.getUser())
        );
    }

}
