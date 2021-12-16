package com.mosheyu.domain;

import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;


@Component
public class Invitation {
    private String invitationId;
    private String invitationTitle;
    private Date creationTime;
    private int discussNum;
    private int pageView;
    private String invitationBody;
    private String writerId;
    private short status;

    public Invitation() {
    }

    //添加帖子时
    public Invitation(String invitationTitle, String invitationBody, String writerId) {
        Date date = new Date();
        //初始化帖子创建时间
        this.creationTime =  date;
        //初始化帖子ID
        //将创建时间格式化转为字符串，拼接用户ID，然后进行MD5加密。
        String sourseTest = new SimpleDateFormat("yyyyMMddhhmmss").format(date) + writerId;
        this.invitationId = DigestUtils.md5DigestAsHex(sourseTest.getBytes(StandardCharsets.UTF_8));
        this.discussNum = 0;
        this.pageView = 0;
        this.invitationTitle = invitationTitle;
        this.invitationBody = invitationBody;
        this.writerId = writerId;
        this.status = 0;
    }

    //数据库中取值，取出帖子
    public Invitation(String invitationId, String invitationTitle, Date creationTime, int pageView, String invitationBody, String writerId) {
        this.invitationId = invitationId;
        this.invitationTitle = invitationTitle;
        this.creationTime = creationTime;
        this.pageView = pageView;
        this.invitationBody = invitationBody;
        this.writerId = writerId;
    }

    public Invitation(String invitationId, String invitationTitle, Date creationTime, int discussNum, int pageView, String invitationBody, String writerId, short status) {
        this.invitationId = invitationId;
        this.invitationTitle = invitationTitle;
        this.creationTime = creationTime;
        this.discussNum = discussNum;
        this.pageView = pageView;
        this.invitationBody = invitationBody;
        this.writerId = writerId;
        this.status = status;
    }

    public String getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(String invitationId) {
        this.invitationId = invitationId;
    }

    public String getInvitationTitle() {
        return invitationTitle;
    }

    public void setInvitationTitle(String invitationTitle) {
        this.invitationTitle = invitationTitle;
    }

    public Date getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Date creationTime) {
        this.creationTime = creationTime;
    }

    public int getDiscussNum() {
        return discussNum;
    }

    public void setDiscussNum(int discussNum) {
        this.discussNum = discussNum;
    }

    public String getInvitationBody() {
        return invitationBody;
    }

    public void setInvitationBody(String invitationBody) {
        this.invitationBody = invitationBody;
    }

    public String getWriterId() {
        return writerId;
    }

    public void setWriterId(String writerId) {
        this.writerId = writerId;
    }

    public short getStatus() {
        return status;
    }

    public void setStatus(short status) {
        this.status = status;
    }

    public int getPageView() {
        return pageView;
    }

    public void setPageView(int pageView) {
        this.pageView = pageView;
    }

    @Override
    public String toString() {
        return "Invitation{" +
                "invitationId='" + invitationId + '\'' +
                ", invitationTitle='" + invitationTitle + '\'' +
                ", creationTime=" + creationTime +
                ", discussNum=" + discussNum +
                ", pageView=" + pageView +
                ", invitationBody='" + invitationBody + '\'' +
                ", writerId='" + writerId + '\'' +
                ", status=" + status +
                '}';
    }
}
