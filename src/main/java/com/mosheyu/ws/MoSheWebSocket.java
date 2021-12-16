package com.mosheyu.ws;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mosheyu.controller.BoardController;
import com.mosheyu.domain.Board;
import com.mosheyu.domain.Message;
import com.mosheyu.service.BoardService;
import com.mosheyu.service.impl.BoardServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint(value = "/msg",configurator = GetHttpSessionConfig.class)
@Component
public class MoSheWebSocket {

    private static Map<String,MoSheWebSocket> webSocketMap = new HashMap<String,MoSheWebSocket>();

    private Board board = new Board();

    private  Session session;

    private HttpSession httpSession;


    private boolean isRed = false;


    @Autowired
    private static BoardService boardService;



    @OnOpen
    public  void onOpen(Session session,EndpointConfig endpointConfig){
        this.session = session;
        HttpSession httpSession1 = (HttpSession) endpointConfig.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession1;

        System.out.println("session打开:"+session);
        System.out.println("HttpSession:"+httpSession1);

        String userName = (String) httpSession.getAttribute("userName");
        webSocketMap.put(userName,this);

        //广播信息，刷新所有人在线人的列表
        Message message = new Message(1,null,null,webSocketMap.keySet().toString());
        sendToAll(message);


    }




    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("接收消息："+message);
        System.out.println("session:"+session);
        Message msg = null;
        try {
            //消息转为对象
            ObjectMapper objectMapper = new ObjectMapper();
             msg = objectMapper.readValue(message,Message.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        //根据消息类型处理
        switch (msg.getMsgType()){
            case 1:
                //刷新在线人数————管理员权限
                sendToAll(msg);
                break;
            case 2:
                //广播信息  ————需要先登录
                sendToAll(msg);
                break;
            case 3:
                //用户私聊  --双方在线
                sendToOne(msg);
                break;
            case 4:
                //  空
                break;

            case 10:
//                用户发起约战请求
                makeInOne(msg);

                sendToOne(msg);

                break;
            case 11:
//                用户拒绝约战请求
                sendToOne(msg);

                removeBoard(msg);

                break;
            case 12:
//                用户允许约战请求

                //   存储棋局对战情况

                sendToOne(msg);

                break;

            case 13:

                //   存储棋局对战情况
                saveBoard(msg);

                //   用户 发送棋局
                sendToOne(msg);


                break;
            case 17:
                //  悔棋

                takeBack(msg);
                //  发送信息
                sendToOne(msg);

                break;
            case 18:
                //  求和申请

                //  发送信息
                sendToOne(msg);

                break;
            case 19:
                //  求和被拒
                //  发送信息
                sendToOne(msg);
                break;
            case 20:
                //  同意求和

                //   用户 发送棋局
                sendToOne(msg);

                //  存储棋局
                saveBoardDetail(msg,3);

                break;
            case 21:
                //  认输

                //  存储棋局
                saveBoardDetail(msg,getWin(msg));
                //   用户 发送棋局
                sendToOne(msg);
                break;
            case 22:
                //  超时认输

                break;
            case 23:

                break;





        }

    }

    //发送到所有人    类型：1、 2
    private void sendToAll(Message message){
        try {
            for (MoSheWebSocket moSheWebSocket : webSocketMap.values()) {
                //如果 是广播给全体发送信息   就不给自己发送了，毕竟是自己发送的信息
                if (!(moSheWebSocket == this && message.getMsgType() ==2)){
                    moSheWebSocket.session.getBasicRemote().sendText(new ObjectMapper().writeValueAsString(message));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("广播信息发送失败。");
        }

    }

    //发送到个人    类型：3
    private void sendToOne(Message messageToOne) throws IOException {


        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = webSocketMap.get(messageToOne.getReceiver());
        if (moSheWS != null){
            moSheWS.session.getBasicRemote().sendText(new ObjectMapper().writeValueAsString(messageToOne));
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
    }




    //    约战时，存储象棋条件
    private void makeInOne(Message messageToOne) throws IOException {
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = webSocketMap.get(messageToOne.getSender());
        if (moSheWS != null){
            moSheWS.isRed = true;
            //  存储  棋局ID，棋局详情，创建时间，先手用户，后手用户，胜负情况，棋局耗时，棋局状态
            String boardId = "";
            long totalMilliSeconds = System.currentTimeMillis();
            System.out.println(totalMilliSeconds);
            String boardStr =DigestUtils.md5DigestAsHex(String.valueOf(totalMilliSeconds).getBytes());;
            //            棋局Id
            moSheWS.board.setBoardId(boardStr);
            //            象棋详情
            //            getMsgAddition    对局详情
            switch (Integer.parseInt(messageToOne.getMsgString())){
                case 0:
                    moSheWS.board.setBoardDetail("?");
                    break;
                case 1:
                default:
                    moSheWS.board.setBoardDetail(messageToOne.getMsgAddition()+"?");
            }
            //      创建时间
            moSheWS.board.setCreationTime(totalMilliSeconds);
            // 红方和黑方用户ID
            moSheWS.board.setUserNameA(messageToOne.getSender());
            moSheWS.board.setUserNameB(messageToOne.getReceiver());
            //  胜负情况
            moSheWS.board.setWin(0);
            //  棋局耗时
            moSheWS.board.setElapsed(0);
            //  棋局状态
            moSheWS.board.setStatus(1);

            System.out.println(moSheWS.board.toString());
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
    }

    //   拒绝约战邀请后，清空象棋对战情况
    private void removeBoard(Message messageToOne) throws IOException {
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = getRedMoSheWebSocket(messageToOne);
        if (moSheWS != null){
            //   清空象棋对战情况
            moSheWS.board = new Board();
            moSheWS.isRed = false;
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
    }

    //    存储象棋走步
    private void saveBoard(Message messageToOne) throws IOException {
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = getRedMoSheWebSocket(messageToOne);
        if (moSheWS != null){
//            moSheWS.board.setBoardDetail( moSheWS.board.getBoardDetail() + messageToOne.getMsgString());
//            rnbakabnr0000000000c00c0000p0p0p0p0p000000000000000000P0P0P0P0P0C00000C0000000000RNBAKABNR?25,22,c,i
            //       ?19,22,c,i

            String boardDatile = messageToOne.getMsgString().substring(91);
            String boardStr = moSheWS.board.getBoardDetail();
            moSheWS.board.setBoardDetail(boardStr + boardDatile + "|");

            System.out.println(moSheWS.board.toString());
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
    }

    //  存储悔棋
    private void takeBack(Message messageToOne){
        int strlen = Integer.parseInt(messageToOne.getMsgAddition());
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = getRedMoSheWebSocket(messageToOne);
        if (moSheWS != null) {
            String boardStr  = moSheWS.board.getBoardDetail();
            boardStr = updateBoard(boardStr,strlen);
            moSheWS.board.setBoardDetail(boardStr);

//?25,22,c,i|70,67,C,i|33,42,p,i|62,53,P,i|29,38,p,i|
        }
    }


    private int   getWin(Message message){
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS =  webSocketMap.get(message.getReceiver());
        if (moSheWS != null){
            // 判断是红还是黑？
            if(moSheWS.isRed){
                return 1;
            }else {
                return 2;
            }
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
        return  0;

    }



    //  存储棋局
    private void saveBoardDetail(Message messageToOne,int status){
        //获取该用户的websocket服务
        MoSheWebSocket moSheWS = getRedMoSheWebSocket(messageToOne);
        if (moSheWS != null){
            Board board = moSheWS.board;
            moSheWS.board.setWin(status);

            long totalMilliSeconds = System.currentTimeMillis();
            long ex = moSheWS.board.getCreationTime()-totalMilliSeconds;
            moSheWS.board.setWin(status);
            moSheWS.board.setElapsed(ex);

//            BoardController boardController = new BoardController();
//            boardController.save(moSheWS.board);
            boardService.saveBoard(moSheWS.board);
            System.out.println(moSheWS.board.toString());
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
            //传回发送失败信息
//            moSheWS = webSocketMap.get(messageToOne.getSender());
        }
    }


    // 静态方法、在SpringBoot启动时被调用
    public static void setMyService(BoardService boardService) {
        MoSheWebSocket.boardService = boardService;
    }







    @OnClose
    public  void onClose(Session session){
        System.out.println("session关闭:"+session);
        System.out.println("关闭连接。");
    }
    @OnError
    public void onError(Session session,Throwable error){
        System.out.println("-------------------------------------------------------");
        error.printStackTrace();
        System.out.println("-------------------------------------------------------");
    }


    //      返回对战双方中红色的一方
    private MoSheWebSocket getRedMoSheWebSocket(Message message) {
        MoSheWebSocket moSheWS = webSocketMap.get(message.getReceiver());
        MoSheWebSocket moSheWB = webSocketMap.get(message.getSender());
        if (moSheWS != null){
            if (moSheWS.isRed){
                return  moSheWS;
            }else {
                {
                    return  moSheWB;
                }
            }
        }else {
//            发送者不在线或不存在
            System.out.println("用户不在线");
        }
        return null;
    }


    //?25,22,c,i|70,67,C,i|33,42,p,i|62,53,P,i|29,38,p,i|
    //  将指定的字符串悔棋，一部分。
    private String updateBoard(String boardStr,int strlen){
        //  最后一次出现“|”  的索引，应该是最末尾
        int lastIndex = boardStr.lastIndexOf("|");
        //  倒数第二个"|"  悔棋一次，截取到这里就行了。
        lastIndex = boardStr.lastIndexOf("|",lastIndex);
        if (strlen == 1) {
            System.out.println( boardStr.substring(0,lastIndex+1));
            return boardStr.substring(0,lastIndex+1);
        }else {
            lastIndex = boardStr.lastIndexOf("|",lastIndex);
            System.out.println( boardStr.substring(0,lastIndex+1));
            return boardStr.substring(0,lastIndex+1);
        }
    }

}
