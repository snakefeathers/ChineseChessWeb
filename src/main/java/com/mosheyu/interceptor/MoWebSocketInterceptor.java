package com.mosheyu.interceptor;

import com.mosheyu.domain.User;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.servlet.http.HttpSession;
import java.util.Map;

//public class MoWebSocketInterceptor implements HandshakeInterceptor {
public class MoWebSocketInterceptor {
    //握手前
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Map<String, Object> map) throws Exception {
//
//        //获取servlet中的session中的用户名，一般不会为空。
//        System.out.println("握手准备");
////        System.out.println("Websocket:用户[ID:" + ((ServletServerHttpRequest) serverHttpRequest).getServletRequest().getSession(false).getAttribute("userName") + "]已经建立连接");
//        if (serverHttpRequest instanceof ServletServerHttpRequest) {
//            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) serverHttpRequest;
//            HttpSession session = servletRequest.getServletRequest().getSession(false);
//
//            User user = (User) session.getAttribute("userName");
//
//            if (user != null) {
//                // 为服务器创建WebSocketSession做准备
//                map.put("userId", user.getUserName());
//                System.out.println("用户id：" + user.getUserName() + " 被加入");
//            } else {
//                System.out.println("user为空");
//                return false;
//            }
//        }
//        return true;
//    }
//
//
//    //握手后
//    @Override
//    public void afterHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Exception e) {
//        System.out.println("握手结束");
//    }
}
