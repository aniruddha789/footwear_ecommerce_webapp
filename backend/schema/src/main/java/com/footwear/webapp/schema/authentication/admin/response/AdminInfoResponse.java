package com.footwear.webapp.schema.authentication.admin.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminInfoResponse {

    @NotBlank
    private String id;
    @NotBlank
    @Size(max = 20)
    private String username;
    @NotBlank
    @Size(max = 20)
    private String email;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
