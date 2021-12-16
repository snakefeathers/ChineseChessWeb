package com.mosheyu.domain;

import org.springframework.stereotype.Component;

@Component
public class Message {
    private int msgType;
    private String sender;
    private String receiver;
    private String msgString;
    private String msgAddition;

    public Message() {
    }

    public Message(int msgType, String sender, String receiver, String msgString) {
        this.msgType = msgType;
        this.sender = sender;
        this.receiver = receiver;
        this.msgString = msgString;
    }


    public Message(int msgType, String sender, String receiver, String msgString, String msgAddition) {
        this.msgType = msgType;
        this.sender = sender;
        this.receiver = receiver;
        this.msgString = msgString;
        this.msgAddition = msgAddition;
    }

    @Override
    public String toString() {
        return "Message{" +
                "msgType=" + msgType +
                ", sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", msgString='" + msgString + '\'' +
                ", msgAddition='" + msgAddition + '\'' +
                '}';
    }

    public String getMsgAddition() {
        return msgAddition;
    }

    public void setMsgAddition(String msgAddition) {
        this.msgAddition = msgAddition;
    }

    public int getMsgType() {
        return msgType;
    }

    public void setMsgType(int msgType) {
        this.msgType = msgType;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getMsgString() {
        return msgString;
    }

    public void setMsgString(String msgString) {
        this.msgString = msgString;
    }
}
