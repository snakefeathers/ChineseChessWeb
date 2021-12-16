package com.mosheyu.controller;


import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.Invitation;
import com.mosheyu.service.DiscussService;
import com.mosheyu.service.InvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/conversation")
public class ConversationController {


    @Autowired
    private InvitationService invitationService;

    @Autowired
    private DiscussService discussService;

    @RequestMapping("/show")
    @ResponseBody
    public List<Invitation> conversation( @RequestParam(value = "pageNO",required = false,defaultValue = "1") Integer pageNO) {
        List<Invitation> invitationList = invitationService.show(pageNO);
        return invitationList;
    }



    //返回页面
    @RequestMapping("/details")
    public String showPage(@RequestParam(value = "id",required = true) String invitationId){
//        ModelAndView modelAndView = new ModelAndView();
//        modelAndView.setViewName("/invitationDetails");
//        return modelAndView;
        return "/invitationDetails";
    }





    //返回帖子详情
    @RequestMapping("/invitationShow")
    @ResponseBody
    public Invitation invitationShowById(@RequestParam(value = "id",required = true) String invitationId){
//        System.out.println("查询帖子详情");
        Invitation invitation = invitationService.selectById(invitationId);
        return invitation;
    }





    //返回评论列表
    @RequestMapping("/discuss")
    @ResponseBody
    public List<Discuss> discussShowById(@RequestParam(value = "id",required = true) String invitationId){
        List<Discuss> discusses = discussService.selectByInviId(invitationId);
        System.out.println(discusses);
//        System.out.println("lll");
        return discusses;
    }

















    public boolean addInvitation(@RequestParam(required = true)Invitation invitation){
        return invitationService.addInvitation(invitation);
    }
    public boolean updateInvitation(@RequestParam(required = true)Invitation invitation){
        return invitationService.updateInvitation(invitation);
    }

    public boolean updateStatus(@RequestParam(required = true)Invitation invitation){
        return invitationService.updateStatus(invitation);
    }


}
