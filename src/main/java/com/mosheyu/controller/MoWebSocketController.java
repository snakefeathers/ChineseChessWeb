package com.mosheyu.controller;

import com.mosheyu.interceptor.MoWebSocketInterceptor;
import com.mosheyu.typehandler.MoWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

//@Component
//@EnableWebSocket
//@Controller
//public class MoWebSocketController implements WebMvcConfigurer, WebSocketConfigurer {
public class MoWebSocketController{

//    //websocket处理器
//    @Autowired
//    private MoWebSocketHandler handler;


//    //计算总数
//    public static Integer count = 0;
//
//    //    跳转到聊天View
//    @RequestMapping("conSocket")
//    public String conSocket(HttpSession session) {
//
//        count++;
//
//        //设置用户
//        session.setAttribute("user", new User());
//
//        return "/webSocket";
//    }


    //设置握手处理器
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry wSHR) {
//        wSHR.addHandler(handler, "/websocketTest").addInterceptors(new MoWebSocketInterceptor());
//    }
//

}
