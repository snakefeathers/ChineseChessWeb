package com.mosheyu.controller;


import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.Invitation;
import com.mosheyu.service.DiscussService;
import com.mosheyu.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
@RequestMapping(value = "/invitation")
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private DiscussService discussService;

    @RequestMapping("/show")
    @ResponseBody
    public List<Invitation> showById(HttpServletRequest httpServletRequest){
        String userName = getUserName(httpServletRequest);
        List<Invitation> invitationList =invitationService.showByUserName(userName,1);
        return invitationList;
    }



    @RequestMapping("/detail")
    @ResponseBody
    public Invitation showByInviid(@RequestParam("id") String invitationId){
        return invitationService.selectById(invitationId);
    }

    //返回帖子详情页面
    @RequestMapping(value = "/add",method = GET)
    public String invitationShow(){
//        System.out.println("查询帖子详情");
//        Invitation invitation = invitationService.selectById(invitationId);
//        return invitation;
        return "/invitationDetails";
    }


    //添加帖子
    @RequestMapping(value = "/add",method = POST)
    @ResponseBody
    public Invitation invitationAddById(@RequestBody Invitation invita){
        Invitation invitation = new Invitation(invita.getInvitationTitle(),invita.getInvitationBody(),invita.getWriterId());
        System.out.println(invitation);
        boolean b = invitationService.addInvitation(invitation);
//        String invitationId = invitation.getInvitationId();
        return invitation;
    }

    //删除帖子
    @RequestMapping(value = "/del")
    public void invitationDelById(@RequestBody Map<String,String> data){
        System.out.println(data);
        boolean b = invitationService.deleteById(data.get("invitationId"));
        return ;
    }
    //删除帖子页面
    @RequestMapping(value = "/update",method = GET)
    public String invitationUpdPage() {
        System.out.println("返回修改页面");
        return "/invitationDetails";
    }

    //修改帖子
    @RequestMapping(value = "/inviUpdate",method = POST)
    @ResponseBody
    public boolean invitationUpdById(@RequestBody Map<String, String> data) {
        System.out.println("开始修改");
        System.out.println(data);
        Invitation invitation = new Invitation();
        invitation.setInvitationId(data.get("invitationId"));
        invitation.setInvitationTitle( data.get("invitationTitle"));
        invitation.setInvitationBody(data.get("invitationBody"));
        System.out.println(invitation);
        boolean b = invitationService.updateInvitation(invitation);
        return b;
    }

    @RequestMapping("/showByUserId")
    @ResponseBody
    public List<Invitation> showByUserName(HttpServletRequest httpServletRequest){
        String userName = getUserName(httpServletRequest);
        List<Invitation> invitationList =invitationService.showByUserName(userName,1);
        return invitationList;
    }






    //添加评论
    @RequestMapping(value = "/discussAdd", method = POST)
    public void discussAdd(@RequestBody Map<String, String> data) {
        System.out.println(data);
//        String discussText, String invitationId, String createDate,String userName
        Discuss discuss = new Discuss(data.get("discussBody"), data.get("invitationId"), data.get("discussDate"), data.get("userName"));
        System.out.println(discuss);
        boolean b = discussService.discussAdd(discuss);
        return;
    }





    //删除帖子
    @RequestMapping(value = "/deleteById")
    @ResponseBody
    public boolean invitationDelById2(@RequestBody Map<String,String> data){
        return invitationService.deleteById(data.get("id"));
    }


















    //根据request获取cookie，读取用户名
    private String getUserName(HttpServletRequest request){
        //获取用户名
        Cookie[] cookies = request.getCookies();
        String userName ="";
        for (Cookie cookie : cookies){
            if ("userName".equals(cookie.getName())){
                userName = cookie.getValue();
            }
        }
        return userName;
    }

}
