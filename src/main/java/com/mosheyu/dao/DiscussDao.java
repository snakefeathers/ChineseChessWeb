package com.mosheyu.dao;

import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.Invitation;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussDao {



    //根据页码查找数据,一页10条数据
    @Select("select discussId,discussText,discuss.invitationId as invitationId,userName,replyId," +
            "discuss.status as status,discuss.creationTime as creationTime,invitation.invitationTitle as invitationTitle   " +
            " from discuss,invitation where invitation.invitationId = discuss.invitationId " +
            "  limit #{dateOrigin}, #{pageSize}")
    @Results({
            @Result(id = true,column = "discussId",property = "discussId"),
            @Result(column = "discussText",property = "discussText"),
            @Result(column = "invitationId",property = "invitationId"),
            @Result(column = "userName",property = "userName"),
            @Result(column = "replyId",property = "replyId"),
            @Result(column = "status",property = "status"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "invitationTitle",property = "inviationTitle")

    })
    public List<Discuss> show(@Param("dateOrigin") int dateOrigin, @Param("pageSize")int pageSize);



    @Select(value = "select discussId,discussText,userName,replyId,creationTime " +
            "from discuss where invitationId = #{disscussId} and status = 1")
    @Results({
            @Result(id = true,column = "discussId",property = "discussId"),
            @Result(column = "discussText",property = "discussText"),
            @Result(column = "userName",property = "userName"),
            @Result(column = "replyId",property = "replyId"),
            @Result(column = "creationTime",property = "creationTime")
    })
    public List<Discuss> selectByInviId(@Param(value = "disscussId") String disscussId);


    @Select(value = "select discussId,discussText,discuss.invitationId as invitationId,userName,replyId," +
            "discuss.status as status,discuss.creationTime as creationTime,invitation.invitationTitle as invitationTitle   " +
            " from discuss,invitation where invitation.invitationId = discuss.invitationId and userName = #{userName}  ")
    @Results({
            @Result(id = true,column = "discussId",property = "discussId"),
            @Result(column = "discussText",property = "discussText"),
            @Result(column = "invitationId",property = "invitationId"),
            @Result(column = "userName",property = "userName"),
            @Result(column = "replyId",property = "replyId"),
            @Result(column = "status",property = "status"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "invitationTitle",property = "inviationTitle")
    })
    public List<Discuss> showByUserName(@Param(value = "userName") String userName);



    @Insert(value = "insert into discuss (discussId,discussText,invitationId,userName,replyId,status,creationTime) values" +
            "( #{Discus.discussId},#{Discus.discussText},#{Discus.invitationId},#{Discus.userName}," +
            "#{Discus.replyId},#{Discus.status},#{Discus.creationTime} )")
    public boolean discussAdd(@Param(value = "Discus") Discuss discuss);


    //删除评论
    @Delete("delete from discuss where discussId = #{disscussId}")
    public boolean deleteById(@Param("disscussId") String disscussId);


}
