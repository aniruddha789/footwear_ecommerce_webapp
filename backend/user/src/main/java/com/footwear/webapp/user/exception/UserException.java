package com.footwear.webapp.user.exception;

import com.footwear.webapp.user.entity.User;

public class UserException extends Exception{

    public UserException(){

    }

    public UserException(String message){
        super(message);
    }

}
