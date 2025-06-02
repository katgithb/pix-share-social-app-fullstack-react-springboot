package com.pixshare.pixshareapi.user;

public enum RoleName {
    USER,
    ADMIN;

    public boolean matches(String roleName) {
        return this.name().equals(roleName);
    }
    
}