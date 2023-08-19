package com.footwear.webapp.admin.controller;

import java.util.HashMap;

import com.footwear.webapp.admin.entity.Admin;
import com.footwear.webapp.admin.service.AdminServiceImpl;
import com.footwear.webapp.schema.authentication.admin.request.LoginRequest;
import com.footwear.webapp.schema.authentication.admin.request.SignupRequest;
import com.footwear.webapp.schema.authentication.admin.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableAutoConfiguration
public class AdminController {

        @Autowired
        AdminServiceImpl adminServiceImpl;
		
	
        @GetMapping("/register")
        public MessageResponse register(@RequestBody SignupRequest signupRequest) throws Exception{

            String username = signupRequest.getUsername();
            String password = signupRequest.getPassword();
            String email = signupRequest.getEmail();

            Admin adm = new Admin(username, password , email);

            String result = adminServiceImpl.addAdmin(adm);

            return new MessageResponse(result);
        }


        @GetMapping("/validateCredentials")
        public @ResponseBody MessageResponse validateCredentials(@RequestBody LoginRequest loginRequest){
                String result = this.adminServiceImpl.validateCredentials(loginRequest.getUsername(), loginRequest.getPassword());
                return new MessageResponse(result);
        }



        @GetMapping("/login")
        public String login() {
        	return "login";
        }

}

