package com.footwear.webapp.admin.controller;

import java.util.ArrayList;
import java.util.HashMap;

import com.footwear.webapp.admin.entity.Admin;
import com.footwear.webapp.admin.entity.User;
import com.footwear.webapp.admin.service.AdminServiceImpl;
import com.footwear.webapp.schema.authentication.admin.request.LoginRequest;
import com.footwear.webapp.schema.authentication.admin.request.SignupRequest;
import com.footwear.webapp.schema.authentication.admin.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@EnableAutoConfiguration
public class AdminController {

        @Autowired
        AdminServiceImpl adminServiceImpl;

        @Autowired
        RestTemplate restTemplate;
		
	
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


        @GetMapping("/getAdmin")
        public ArrayList<Admin> getAdmin(){
//            User usr = restTemplate.getForEntity("http://localhost:8082/getUser/aniruddha", User.class).getBody();
//            System.out.println(" DEBUG admin" + usr.getEmail());
//            System.out.println(" DEBUG admin" + usr.getUsername());
//            System.out.println(" DEBUG admin" + usr.getPassword());
            return this.adminServiceImpl.getAdmins();
        }

        @GetMapping("/getAdmin/{username}")
        public Admin getAdmin(@PathVariable String username){
            return this.adminServiceImpl.getAdmin(username);
        }

        @GetMapping("/deleteAdmin/{username}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String username){
            String result = this.adminServiceImpl.deleteAdmin(username);
            return new ResponseEntity<>(result, HttpStatus.OK);

        }
        @GetMapping("/login")
        public String login() {
        	return "login";
        }

}

