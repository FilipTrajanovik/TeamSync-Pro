package com.managementappbackend.model.enumerations;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USER, MANAGER, ADMIN, OWNER;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
    }

