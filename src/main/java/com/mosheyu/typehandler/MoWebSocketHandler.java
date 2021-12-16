package com.mosheyu.typehandler;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.mosheyu.domain.UserMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.CloseStatus;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;



public class MoWebSocketHandler implements WebSocketHandler {
    public static final Map<String, WebSocketSession> sessionMap;

    static {
        sessionMap = new HashMap<>();
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
            //连接后执行
        System.out.println("afterConnectionEstablished");
        //如果用户还未登记，就进行登记
        String userName = (String) webSocketSession.getAttributes().get("userName");
        if (sessionMap.get(userName) == null) {
            sessionMap.put(userName, webSocketSession);
        }
    }

    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
        System.out.println("handleMessage");
            //消息发送前
        //满了，就不处理
        if (webSocketMessage.getPayloadLength() == 0) {
            return;
        }

        //得到Socket通道中的数据并转化为信息对象
         UserMessage userMessage = new Gson().fromJson(webSocketMessage.getPayload().toString(), UserMessage.class);
        System.out.println("转换完成");
        //获取现在的时间戳
        Timestamp nowTime = new Timestamp(System.currentTimeMillis());
        //将时间戳存储到用户信息中
        userMessage.setMessageDate(Long.parseLong(nowTime.toString()));

        //将信息保存至数据库
        //sendMsgService.addMessage(msg.getFromId(), msg.getFromName(), msg.getToId(), msg.getMessageText(), msg.getMessageDate());

        //发送Socket信息
        WebSocketSession session = sessionMap.get(userMessage.getOtherId());
        //判断用户是否登录，是否接收消息
        if (session != null && session.isOpen()) {
            session.sendMessage( new TextMessage(new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().toJson(userMessage)));
        }


    }

    @Override
    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
            //连接失败后
        System.out.println("连接失败了");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {
        System.out.println("afterConnectionClosed");
            //连接关闭前
        System.out.println("WebSocket:" + webSocketSession.getAttributes().get("userName") + " 准备关闭");
        Iterator<Map.Entry<String, WebSocketSession>> iterator = sessionMap.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, WebSocketSession> entry = iterator.next();
            if (entry.getValue().getAttributes().get("userName") == webSocketSession.getAttributes().get("userName")) {
                sessionMap.remove(webSocketSession.getAttributes().get("userName"));
                System.out.println("WebSocket 在存储中:" + webSocketSession.getAttributes().get("userName") + " 移除了");
            }
        }
    }

    @Override
    public boolean supportsPartialMessages() {
        //是否支持局部消息
        return false;
    }



}
