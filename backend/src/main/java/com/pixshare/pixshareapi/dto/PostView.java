package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.time.ZonedDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class PostView {
    private Long id;
    private String caption;
    private String image;
    private String location;
    private ZonedDateTime createdAt;
    private UserView user;
}
