package com.mosheyu.controller;


import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.Invitation;
import com.mosheyu.service.DiscussService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/discuss")
public class DiscussController {



    @Autowired
    private DiscussService discussService;

    @RequestMapping("/showByUserId")
    @ResponseBody
    public List<Discuss> showByUserName(HttpServletRequest httpServletRequest,@CookieValue(value="userName")String userName){
        List<Discuss> discussList =discussService.showByUserName(userName);
        return discussList;
    }

    //删除评论
    @RequestMapping(value = "/deleteById")
    @ResponseBody
    public boolean discussDelById(@RequestBody Map<String,String> data){
        boolean b = discussService.deleteById(data.get("id"));
        return b;
    }







}
