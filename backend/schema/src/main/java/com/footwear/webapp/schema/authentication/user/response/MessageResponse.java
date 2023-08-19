package com.footwear.webapp.schema.authentication.user.response;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class MessageResponse {

    @NotBlank
    @Size(max = 2000)
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MessageResponse(String message) {
        this.message = message;
    }
}
