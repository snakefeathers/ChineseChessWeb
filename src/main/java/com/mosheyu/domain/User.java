package com.mosheyu.domain;


import org.springframework.stereotype.Component;

@Component
public class User {
    private String userName;
    private String userPassword;
    private String joinDate;
    private String photoUrl;
    private String introduction;
    private int sex;
    private int age;
    //是否禁用
    private int status;
    //用户种类
    private int userType;
    //用户游戏局数
    private int inningsNum;
    //用户帖子数
    private int inviNum;
    //用户评论总数
    private int disNum;

    public User() {

    }


    public User(String userName, String userPassword) {
        this(userName,userPassword,
                Long.toString(System.currentTimeMillis()),
                "2.jpg","用户："+userName,
                0,10,
                0,0);
    }


    public User(String userName, String userPassword, String joinDate, String photoUrl, String introduction, int sex, int age, int status, int userType) {
        this(userName,userPassword,joinDate,photoUrl,introduction,sex,age,status,userType,0,0,0);
    }

    public User(String userName, String userPassword, String joinDate, String photoUrl, String introduction, int sex, int age, int status, int userType, int inningsNum, int inviNum, int disNum) {
        this.userName = userName;
        //后期进行MD5加密
        this.userPassword = userPassword;
        this.joinDate = joinDate;
        this.photoUrl = photoUrl;
        this.introduction = introduction;
        this.sex = sex;
        this.age = age;
        this.status = status;
        this.userType = userType;
        this.inningsNum = inningsNum;
        this.inviNum = inviNum;
        this.disNum = disNum;
    }

    @Override
    public String toString() {
        return "User{" +
                "userName='" + userName + '\'' +
                ", userPassword='" + userPassword + '\'' +
                ", joinDate='" + joinDate + '\'' +
                ", photoUrl='" + photoUrl + '\'' +
                ", introduction='" + introduction + '\'' +
                ", sex=" + sex +
                ", age=" + age +
                ", status=" + status +
                ", userType=" + userType +
                ", inningsNum=" + inningsNum +
                ", inviNum=" + inviNum +
                ", disNum=" + disNum +
                '}';
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(String joinDate) {
        this.joinDate = joinDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public int getInningsNum() {
        return inningsNum;
    }

    public void setInningsNum(int inningsNum) {
        this.inningsNum = inningsNum;
    }

    public int getInviNum() {
        return inviNum;
    }

    public void setInviNum(int inviNum) {
        this.inviNum = inviNum;
    }

    public int getDisNum() {
        return disNum;
    }

    public void setDisNum(int disNum) {
        this.disNum = disNum;
    }
}
