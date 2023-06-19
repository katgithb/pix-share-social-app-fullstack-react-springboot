package com.pixshare.pixshareapi.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserView {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String userImage;
}
