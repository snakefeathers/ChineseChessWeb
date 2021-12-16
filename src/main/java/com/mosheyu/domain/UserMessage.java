package com.mosheyu.domain;

public class UserMessage {

    private String messageId;


    private String userId;


    private String userName;


    private String otherId;

    private String mesBody;

    private long messageDate;


    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOtherId() {
        return otherId;
    }

    public void setOtherId(String otherId) {
        this.otherId = otherId;
    }

    public String getMesBody() {
        return mesBody;
    }

    public void setMesBody(String mesBody) {
        this.mesBody = mesBody;
    }

    public long getMessageDate() {
        return messageDate;
    }

    public void setMessageDate(long messageDate) {
        this.messageDate = messageDate;
    }
}
