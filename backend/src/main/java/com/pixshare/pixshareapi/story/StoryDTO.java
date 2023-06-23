package com.pixshare.pixshareapi.story;

import com.pixshare.pixshareapi.user.UserView;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class StoryDTO {
    private Long id;
    private String image;
    private String caption;
    private LocalDateTime timestamp;
    private UserView user;
}
