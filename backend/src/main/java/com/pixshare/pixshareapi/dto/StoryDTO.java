package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class StoryDTO {
    private Long id;
    private String imageUploadId;
    private String image;
    private String caption;
    private ZonedDateTime timestamp;
    private UserView user;
}
