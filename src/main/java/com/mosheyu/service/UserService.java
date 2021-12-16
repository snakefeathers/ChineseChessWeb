package com.mosheyu.service;

import com.mosheyu.domain.User;

import java.util.List;

public interface UserService {
    public boolean loginCheck(String username, String password);

    public boolean userExists(String userName);

    public boolean userRegister(String userName,String password);


    public List<User> show(int pageNo);


    public User findOneByName(String username);

    public User findOne(String username,String password);


    public boolean updateUser(User user,String photoUrl);


    public boolean updateUserPassword(String userName,String userPassword);


    public boolean deleteById(String userId);


    public boolean updataPhotoUrl(String userName,String phothUrl);
}
