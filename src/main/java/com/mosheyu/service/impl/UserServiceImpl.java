package com.mosheyu.service.impl;

import com.mosheyu.dao.UserDao;
import com.mosheyu.domain.User;
import com.mosheyu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.List;


@Service(value = "UserService")
public class UserServiceImpl implements UserService {


    //页码从1开始
    //一页的大小
    int PAGESIZE = 10;

    @Autowired
    private UserDao userDao;


    @Override
    public boolean loginCheck(String username, String password) {

        String passwordMd5 = DigestUtils.md5DigestAsHex(password .getBytes());
        System.out.println(passwordMd5);
        return userDao.userChack(username,password);
    }

    @Override
    public boolean userExists(String userName) {
        return userDao.userExist(userName);
    }

    @Override
    public boolean userRegister(String userName, String password) {
        User user = new User(userName,password);
        return userDao.userRegister(user);
    }

    @Override
    public List<User> show(int pageNo) {
        //根据页码，计算数据起始位置。
        int dateOrigin = (pageNo-1)*PAGESIZE;
        return userDao.show(dateOrigin,PAGESIZE);
    }

    @Override
    public User findOneByName(String username) {
        return userDao.findOneByName(username);
    }

    @Override
    public User findOne(String username, String password) {
        return userDao.findOne(username,password);
    }

    @Override
    public boolean updateUser(User user, String photoUrl) {
        if ("".equals(photoUrl)){
            photoUrl = this.findOneByName(user.getUserName()).getPhotoUrl();
        }
        user.setPhotoUrl(photoUrl);
        return userDao.updateUser(user);
    }

    @Override
    public boolean updateUserPassword(String userName, String userPassword) {
        return userDao.updateUserPassword(userName,userPassword);
    }

    @Override
    public boolean deleteById(String userId) {
        return userDao.deleteById(userId);
    }

    @Override
    public boolean updataPhotoUrl(String userName, String phothUrl) {
        return false;
    }
}
