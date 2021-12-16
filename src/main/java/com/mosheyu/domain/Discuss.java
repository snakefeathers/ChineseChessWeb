package com.mosheyu.domain;

import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;

public class Discuss {
    private String discussId;
    private String discussText;
    private String invitationId;
    private String userName;
    private String replyId;
    private int status;
    private long creationTime;
    private User user;

    private String inviationTitle;


    public Discuss() {
    }

    public Discuss(String discussId, String discussText, String userName, String replyId, long creationTime) {
        this.discussId = discussId;
        this.discussText = discussText;
        this.userName = userName;
        this.replyId = replyId;
        this.creationTime = creationTime;
    }

    public Discuss(String discussText, String invitationId, String createDate, String userName) {
        this.discussId = DigestUtils.md5DigestAsHex(discussText.getBytes(StandardCharsets.UTF_8));
        this.discussText = discussText;
        this.invitationId = invitationId;
        this.userName = userName;
        this.creationTime = Long.parseLong(createDate);
        this.replyId = "1";
        this.status = 1;

    }

    public Discuss(String discussId, String discussText, String invitationId, String userName, String replyId, int status, long creationTime) {
        this.discussId = discussId;
        this.discussText = discussText;
        this.invitationId = invitationId;
        this.userName = userName;
        this.replyId = replyId;
        this.status = status;
        this.creationTime = creationTime;
    }

    public Discuss(String discussId, String discussText, String invitationId, String userName, String replyId, int status, long creationTime, String inviationTitle) {
        this.discussId = discussId;
        this.discussText = discussText;
        this.invitationId = invitationId;
        this.userName = userName;
        this.replyId = replyId;
        this.status = status;
        this.creationTime = creationTime;
        this.inviationTitle = inviationTitle;
    }

    @Override
    public String toString() {
        return "Discuss{" +
                "discussId='" + discussId + '\'' +
                ", discussText='" + discussText + '\'' +
                ", invitationId='" + invitationId + '\'' +
                ", userName='" + userName + '\'' +
                ", replyId='" + replyId + '\'' +
                ", status=" + status +
                ", creationTime=" + creationTime +
                ", user=" + user +
                ", inviationTitle='" + inviationTitle + '\'' +
                '}';
    }

    public String getInviationTitle() {
        return inviationTitle;
    }

    public void setInviationTitle(String inviationTitle) {
        this.inviationTitle = inviationTitle;
    }

    public String getDiscussId() {
        return discussId;
    }

    public void setDiscussId(String discussId) {
        this.discussId = discussId;
    }

    public String getDiscussText() {
        return discussText;
    }

    public void setDiscussText(String discussText) {
        this.discussText = discussText;
    }

    public String getInvitationId() {
        return invitationId;
    }

    public void setInvitationId(String invitationId) {
        this.invitationId = invitationId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getReplyId() {
        return replyId;
    }

    public void setReplyId(String replyId) {
        this.replyId = replyId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public long getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(long creationTime) {
        this.creationTime = creationTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
