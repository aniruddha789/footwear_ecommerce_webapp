package com.footwear.webapp.user.service;

import com.footwear.webapp.user.entity.User;
import com.footwear.webapp.user.exception.UserException;
import com.footwear.webapp.user.repository.UserRepository;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


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
                throw new UserException("Username already exist!");

            if (userRepository.existsByEmail(user.getEmail()))
                throw new UserException("Email already exist!");

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
    

}
