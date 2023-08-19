package com.footwear.webapp.user.controller;


import com.footwear.webapp.schema.authentication.user.request.*;
import com.footwear.webapp.schema.authentication.user.response.MessageResponse;
import com.footwear.webapp.user.service.UserServiceImpl;
import com.footwear.webapp.user.entity.User;
import org.aspectj.bridge.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    UserServiceImpl userService;

    @GetMapping("/addUser")
    public @ResponseBody MessageResponse addUser(@RequestBody SignupRequest user) throws Exception{

        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String userName = user.getUsername();
        String email = user.getEmail();
        String password = user.getPassword();

        User newUser = new User(firstName, lastName, userName, email, password);
        String status = this.userService.adduser(newUser);

        return new MessageResponse(status);
    }


    public @ResponseBody MessageResponse validateCredentials(@RequestBody LoginRequest loginRequest){
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        String result = this.userService.validateCredentials(username,password);

        return new MessageResponse(result);
    }


}
