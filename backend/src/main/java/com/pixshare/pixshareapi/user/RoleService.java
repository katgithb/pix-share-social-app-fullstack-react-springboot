package com.pixshare.pixshareapi.user;

import com.pixshare.pixshareapi.exception.ResourceNotFoundException;

public interface RoleService {

    Role getRoleByName(String roleName) throws ResourceNotFoundException;

}
