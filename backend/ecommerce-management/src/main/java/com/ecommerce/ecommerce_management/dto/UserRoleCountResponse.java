package com.ecommerce.ecommerce_management.dto;

import com.ecommerce.ecommerce_management.entity.Role;

public class UserRoleCountResponse {

    private Role role;
    private long count;

    public UserRoleCountResponse(Role role, long count) {
        this.role = role;
        this.count = count;
    }

    public Role getRole() {
        return role;
    }

    public long getCount() {
        return count;
    }
}