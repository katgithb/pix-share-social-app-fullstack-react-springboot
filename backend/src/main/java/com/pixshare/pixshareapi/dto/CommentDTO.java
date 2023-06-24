package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserView user;
    private Set<UserView> likedByUsers;
}
