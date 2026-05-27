package com.ark.AviClear.dto;

import com.ark.AviClear.entity.Role;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private Role role;
}
