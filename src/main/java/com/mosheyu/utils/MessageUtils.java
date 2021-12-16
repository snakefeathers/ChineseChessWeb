package com.mosheyu.utils;

import com.mosheyu.domain.Message;

public class MessageUtils {
    public static String msgTransition(Integer msgType,String sender,String msgString){
//        try{
//            ResultMessage resultMessage = new ResultMessage();
//            resultMessage.setSystem(isSystemMessage);
//            resultMessage.setMessage(message);
//            if(fromName != null){
//                resultMessage.setFromName(fromName);
//            }
////            if(toName !=null ){
////                resultMessage.setToName(toName);
////            }
//            ObjectMapper mapper = new ObjectMapper();
//            return mapper.writeValueAsString(resultMessage);
//        }catch (JsonProcessingException e){
//            e.printStackTrace();
//        }
//        return null;

        Message message = new Message();
        message.setMsgType(msgType);

        switch (msgType){
            case 1:
        }
        return "";
    }
}
