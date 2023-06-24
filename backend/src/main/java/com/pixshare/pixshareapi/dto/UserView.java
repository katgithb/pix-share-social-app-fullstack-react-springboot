package com.pixshare.pixshareapi.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserView {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String userImage;
}
