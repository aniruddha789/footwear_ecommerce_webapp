package com.footwear.webapp.user.controller;



import com.footwear.webapp.user.schema.request.LoginRequest;
import com.footwear.webapp.user.schema.request.SignupRequest;
import com.footwear.webapp.user.schema.response.MessageResponse;
import com.footwear.webapp.user.service.UserServiceImpl;
import com.footwear.webapp.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserServiceImpl userServiceImpl;

    @PostMapping("/addUser")
    public @ResponseBody MessageResponse addUser(@RequestBody SignupRequest user) throws Exception{

        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String userName = user.getUsername();
        String email = user.getEmail();
        String password = user.getPassword();

        User newUser = new User(firstName, lastName, userName, password, email);
        String status = this.userServiceImpl.adduser(newUser);

        return new MessageResponse(status);
    }


    public @ResponseBody MessageResponse validateCredentials(@RequestBody LoginRequest loginRequest){
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        String result = this.userServiceImpl.validateCredentials(username,password);

        return new MessageResponse(result);
    }

    @GetMapping("/getUser")
    public ArrayList<User> getUser(){
        return this.userServiceImpl.getUsers();
    }

    @GetMapping("/getUser/{username}")
    public User getUser(@PathVariable String username) {
        return this.userServiceImpl.getUser(username);
    }

    @GetMapping("/getMemory")
    public long getMemory(){
        return Runtime.getRuntime().maxMemory() / 1024 / 1024;
    }

}
