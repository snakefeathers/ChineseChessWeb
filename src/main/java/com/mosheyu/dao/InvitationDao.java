package com.mosheyu.dao;

import com.mosheyu.domain.Invitation;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface InvitationDao {


    //根据页码查找数据,一页10条数据
    @Select("select invitationId,invitationTitle,creationTime,pageview,invitationBody  " +
            "from invitation  limit #{dateOrigin}, #{pageSize}")
    @Results({
            @Result(id = true,column = "invitationId",property = "invitationId"),
            @Result(column = "invitationTitle",property = "invitationTitle"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "pageview",property = "pageView"),
            @Result(column = "invitationBody",property = "invitationBody")

    })
    public List<Invitation> show(@Param("dateOrigin") int dateOrigin,@Param("pageSize")int pageSize);


    //根据页码查找数据,一页10条数据
    @Select("select invitationId,invitationTitle,creationTime,pageview,left(invitationBody,300) as invitationBody  " +
            "from invitation where writerId = #{userName} limit #{dateOrigin}, #{pageSize}")
    @Results({
            @Result(id = true,column = "invitationId",property = "invitationId"),
            @Result(column = "invitationTitle",property = "invitationTitle"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "pageview",property = "pageView"),
            @Result(column = "invitationBody",property = "invitationBody")

    })
    public List<Invitation> showByUserName(@Param("userName")String userName ,@Param("dateOrigin") int dateOrigin,@Param("pageSize")int pageSize);

    //根据帖子ID查看帖子详情
    @Select("select * from invitation where invitationId = #{invitationId}")
    @Results({
            @Result(id = true,column = "invitationId",property = "invitationId"),
            @Result(column = "invitationTitle",property = "invitationTitle"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "discussNum",property = "discussNum"),
            @Result(column = "pageview",property = "pageView"),
            @Result(column = "invitationBody",property = "invitationBody"),
            @Result(column = "writerId",property = "writerId")

    })
    public Invitation selectById(@Param("invitationId")String invitation);


    //  查询公告
    @Select("select invitationId,invitationTitle,creationTime,pageview,left(invitationBody,300) as invitationBody  " +
            "from invitation where status = 1 limit 0,10")
    @Results({
            @Result(id = true,column = "invitationId",property = "invitationId"),
            @Result(column = "invitationTitle",property = "invitationTitle"),
            @Result(column = "creationTime",property = "creationTime"),
            @Result(column = "pageview",property = "pageView"),
            @Result(column = "invitationBody",property = "invitationBody")

    })
    public  List<Invitation>  announcementShow();


    //添加帖子，添加成功返回布尔类型。实体的七个值对应数据库的七个字段。
    @Insert("insert into invitation ( invitationId,invitationTitle,creationTime,pageview,invitationBody,writerId,status) " +
            "values (#{invitation.invitationId},#{invitation.invitationTitle},#{invitation.creationTime,typeHandler=com.mosheyu.typehandler.dateTypeHandler}" +
            ",#{invitation.pageView},#{invitation.invitationBody},#{invitation.writerId},#{invitation.status})")
    public boolean addInvitation(@Param("invitation") Invitation invitation);


    //判断帖子是否存在
    @Select("select count(invitationId) from invitation where invitationId = #{invitationId}")
    public boolean isExistInvitation(@Param("invitationId")String invitationId);


    //修改帖子，修改标题，正文，状态信息，浏览数。其中的ID，创建时间，作者ID都不用修改。
    @Update("update invitation set invitationTitle = #{invitation.invitationTitle}," +
            "invitationBody = #{invitation.invitationBody}  where invitationId = #{invitation.invitationId}")
    public boolean updateInvitation(@Param("invitation")Invitation invitation);


    //修改帖子，修改状态
    @Update("update invitation set status = #{invitation.status}  where invitationId = #{invitation.invitationId}")
    public boolean updateStatus(@Param("invitation")Invitation invitation);




    //删除帖子，根据ID删除帖子。
    @Delete("delete from invitation where invitationId = #{invitationId}")
    public boolean deleteById(@Param("invitationId")String invitationId);


















}
