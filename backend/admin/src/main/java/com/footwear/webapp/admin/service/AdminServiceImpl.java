package com.footwear.webapp.admin.service;


import com.footwear.webapp.admin.entity.Admin;
import com.footwear.webapp.admin.repository.AdminRepository;
import com.footwear.webapp.admin.util.AdminException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
public class AdminServiceImpl implements AdminService{

    @Autowired
    AdminRepository adminRepository;

    public String addAdmin(Admin admin) throws Exception{
        Admin adm;
        try {
            if (admin == null)
                throw new AdminException("No details provided for Admin, NULL!");

            if (adminRepository.existsByUsername(admin.getUsername()))
                throw new AdminException("Username already exist!");

            if (adminRepository.existsByEmail(admin.getEmail()))
                throw new AdminException("Email already exist!");

            adm = adminRepository.save(admin);

        }
        catch(AdminException e) {
            return e.toString();
        }
        if (adm != null) return "Successful";
        return "Unsuccessful";
    }

    public String validateCredentials(String username, String password){


        String status = "";

        if(!this.adminRepository.existsByUsername(username))
            status = "Username not found";

        else{
            Admin adm = this.adminRepository.findByUsername(username).get();
            if(adm.getPassword().equals(password)){
                status = "valid";
            }
            else {
                status = "invalid";
            }
        }

        return status;

    }



}





