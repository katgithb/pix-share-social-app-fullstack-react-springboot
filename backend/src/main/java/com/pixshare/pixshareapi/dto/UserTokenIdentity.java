package com.pixshare.pixshareapi.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserTokenIdentity {
    private Long id;
    private String email;
    private List<String> roles;
}
