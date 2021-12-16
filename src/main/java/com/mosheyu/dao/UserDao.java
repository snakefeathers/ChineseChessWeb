package com.mosheyu.dao;

import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao {

    //用户登录，合适用户账户，密码，状态
    @Select("select COUNT(userName) from user where userName = #{username} and userPassword = #{password} and status = 0")
    public boolean userChack(@Param("username") String username,@Param("password") String password);


    //查询某个用户是否存在
    @Select("select COUNT(userName) from user where userName = #{userName}")
    public boolean userExist(@Param("userName")String userName);

    //添加用户
    @Insert("insert into user(userName,userPassword,joinDate,photoUrl,introduction,sex,age,status,type) values " +
            "(#{user.userName},#{user.userPassword},#{user.joinDate},#{user.photoUrl}," +
            "#{user.introduction},#{user.sex},#{user.age},#{user.status},#{user.userType})")
    public boolean userRegister(@Param(value = "user") User user);



    //根据页码查找数据,一页10条数据
    @Select("select userName,joinDate,photoUrl,introduction,sex,age,status,type from user " +
            "  limit #{dateOrigin}, #{pageSize}")
    @Results({
            @Result(id = true,column = "userName",property = "userName"),
            @Result(column = "joinDate",property = "joinDate"),
            @Result(column = "photoUrl",property = "photoUrl"),
            @Result(column = "introduction",property = "introduction"),
            @Result(column = "sex",property = "sex"),
            @Result(column = "age",property = "age"),
            @Result(column = "status",property = "status"),
            @Result(column = "type",property = "userType")

    })
    public List<User> show(@Param("dateOrigin") int dateOrigin, @Param("pageSize")int pageSize);



    //根据用户名获取用户信息
    @Select("select userName,userPassword,joinDate,photoUrl,introduction,sex,age,status,type " +
            "from user where userName = #{username}  and status = 0")
    @Results({
            @Result(id = true,column = "userName",property = "userName"),
            @Result(column = "userPassword",property = "userPassword"),
            @Result(column = "joinDate",property = "joinDate"),
            @Result(column = "photoUrl",property = "photoUrl"),
            @Result(column = "introduction",property = "introduction"),
            @Result(column = "sex",property = "sex"),
            @Result(column = "age",property = "age"),
            @Result(column = "type",property = "userType"),
            @Result(column = "status",property = "status")
    })
    public User findOneByName(@Param("username") String username);


    //根据用户名获取用户信息
    @Select("select userName,userPassword,joinDate,photoUrl,introduction,sex,age,status,type " +
            "from user where userName = #{username} and userPassword = #{password} and status = 0")
    @Results({
            @Result(id = true,column = "userName",property = "userName"),
            @Result(column = "userPassword",property = "userPassword"),
            @Result(column = "joinDate",property = "joinDate"),
            @Result(column = "photoUrl",property = "photoUrl"),
            @Result(column = "introduction",property = "introduction"),
            @Result(column = "sex",property = "sex"),
            @Result(column = "age",property = "age"),
            @Result(column = "type",property = "userType"),
            @Result(column = "status",property = "status")
    })
    public User findOne(@Param("username") String username, @Param("password") String password);


    @Update("update user set " +
            "photoUrl = #{user.photoUrl} ,introduction =  #{user.introduction}," +
            "sex = #{user.sex} , age =  #{user.age} " +
            " where userName = #{user.userName} ")
    public boolean updateUser(@Param(value = "user") User user);



    @Update("update user set  userPassword =  #{password}  where userName = #{username} ")
    public boolean updateUserPassword(@Param("username") String username, @Param("password") String password);






    //删除用户，根据ID删除用户。
    @Delete("delete from user where userName = #{username}")
    public boolean deleteById(@Param("username") String username);







}
