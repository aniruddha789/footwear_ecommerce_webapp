package com.footwear.webapp.user.service;

import com.footwear.webapp.user.entity.User;
import com.footwear.webapp.user.exception.UserException;
import com.footwear.webapp.user.repository.UserRepository;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserServiceImpl implements UserService{



    @Autowired
    UserRepository userRepository;
    
    
    public User getUserByUsername(String username){
        return this.userRepository.findByUsername(username).get();
    }


    public String adduser(User user) throws Exception{
        User usr;
        try {
            if (user == null)
                throw new UserException("No details provided for user, NULL!");

            if (userRepository.existsByUsername(user.getUsername()))
                throw new UserException("Username " + user.getUsername() + " already exist!");

            if (userRepository.existsByEmail(user.getEmail()))
                throw new UserException("Email " + user.getEmail() + " already exist!");

            usr = userRepository.save(user);

        }
        catch(UserException e) {
            return e.toString();
        }
        if (usr != null) return "Successful";
        return "Unsuccessful";
    }

    public String validateCredentials(String username, String password){


        String status = "";

        if(!this.userRepository.existsByUsername(username))
            status = "Username not found";

        else{
            User usr = this.userRepository.findByUsername(username).get();
            if(usr.getPassword().equals(password)){
                status = "valid";
            }
            else {
                status = "invalid";
            }
        }

        return status;

    }

    public ArrayList<User> getUsers(){
        return (ArrayList<User>) userRepository.findAll();
    }

    public User getUser(String username){

        User user = userRepository.findByUsername(username).get();
        if(user != null)
            return user;
        else
            return null;
    }
    

}
