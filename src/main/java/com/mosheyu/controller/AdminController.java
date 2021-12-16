package com.mosheyu.controller;


import com.mosheyu.domain.Board;
import com.mosheyu.domain.Discuss;
import com.mosheyu.domain.Invitation;
import com.mosheyu.domain.User;
import com.mosheyu.service.BoardService;
import com.mosheyu.service.DiscussService;
import com.mosheyu.service.InvitationService;
import com.mosheyu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminController {


    @Resource(name = "UserService")
    private UserService userService;

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private DiscussService discussService;

    @Autowired
    private BoardService boardService;




    //      获取棋局列表
    @RequestMapping(value = "/show")
    @ResponseBody
    public  List<Invitation> boardShow(){
        List<Invitation> invitationList = invitationService.announcementShow();
        return invitationList;
    }



    //      获取棋局列表
    @RequestMapping(value = "/board")
    @ResponseBody
    public  List<Board> boardShow(@RequestBody Map<String, String> data, @CookieValue(value="userName")String userName){
        Integer pageNo = Integer.parseInt(data.get("pageNo"));
        List<Board> boardList = boardService.show(pageNo);
        return boardList;
    }
    //      获取帖子列表
    @RequestMapping(value = "/invitation")
    @ResponseBody
    public  List<Invitation> invitationShow(@RequestBody Map<String, String> data, @CookieValue(value="userName")String userName){
        Integer pageNo = Integer.parseInt(data.get("pageNo"));
        List<Invitation> invitationList = invitationService.show(pageNo);
        return invitationList;
    }
    //      获取评论列表
    @RequestMapping(value = "/discuss")
    @ResponseBody
    public  List<Discuss> discussShow(@RequestBody Map<String, String> data, @CookieValue(value="userName")String userName){
        Integer pageNo = Integer.parseInt(data.get("pageNo"));
        List<Discuss> discussList = discussService.show(pageNo);
        return discussList;
    }
    //      获取用户列表
    @RequestMapping(value = "/user")
    @ResponseBody
    public  List<User> userShow(@RequestBody Map<String, String> data, @CookieValue(value="userName")String userName){
        Integer pageNo = Integer.parseInt(data.get("pageNo"));
        List<User> userList = userService.show(pageNo);
        return userList;
    }
    //根据用户名，返回用户具体信息
    @RequestMapping(value = "/personal")
    @ResponseBody
    public  User personalShow( @CookieValue(value="userName")String userName){
        User user = userService.findOneByName(userName);
        return user;
    }

    //  删除棋局
    @RequestMapping(value = "/deleteById")
    @ResponseBody
    public  Map<String,Object> deleteBoard(@RequestBody Map<String, Object> data,@CookieValue(value="userName")String userName){
        int deleteType = (Integer) data.get("type");
        String deleteId = (String) data.get("id");
        Map<String,Object> jsonMap = new HashMap<>();
        boolean status = false;
        switch (deleteType){
            //  删除棋局
            case 0:
                status = boardService.deleteById(deleteId);
                break;
            //  删除帖子
            case 1:
                status = invitationService.deleteById(deleteId);
                break;
            //  删除评论
            case 2:
                status = discussService.deleteById(deleteId);
                break;
            //  删除用户
            case 3:
                status = userService.deleteById(deleteId);
                break;
            case 4:
                status = false;
                break;
        }
        jsonMap.put("status",status);

        return jsonMap;
    }













    //根据用户名，修改具体信息
    @RequestMapping(value = "/updateUser")
    public ModelAndView userUpdate(HttpServletRequest request, User user, @RequestParam("modalUserPhoto") MultipartFile file){
        System.out.println(user);
        String userName = user.getUserName();

        String userPhoto = "";
        try {
            userPhoto= this.upload(request,userName,file);
        } catch (IOException e) {
            e.printStackTrace();
        }
        boolean b = userService.updateUser(user,userPhoto);
        System.out.println(user);

        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("redirect:/centerAdmin.html");
        return modelAndView;
    }



    private String upload(HttpServletRequest request, String userName,MultipartFile file)
            throws IllegalStateException, IOException {
        System.out.println("文件");
        if (file != null &&!file.isEmpty()){
            //获取文件原始名称
            String name = file.getOriginalFilename();
            //获取项目的路径，作为图片保存的目标目录
            String path = request.getSession().getServletContext().getRealPath("");
            String pathq = request.getServletContext().getRealPath("");
            String path2 = "D:\\007SpringBoot\\src\\main\\resources\\static";
            //修改文件名
            String fileName = updateFileName(name,userName);
            //包含路径
            path = path2 + "\\photos\\" + fileName;
            //生成文件
            File file1 = new File(path);
            file.transferTo(file1);

//            FileCopyUtils.copy(file.getInputStream(), Files.newOutputStream(file1.toPath()));


//            FileUtils.copyInputStreamToFile(uploadFile.getInputStream(),dest);


            return fileName;
        }else {
            return "";
        }


    }


    //将原来的文件改为用户名
    private String updateFileName(String fileName, String userName) {
        String[] nameArr = fileName.split("\\.");
        //获取文件后缀
        String suffix = nameArr[nameArr.length - 1];
        //文件名设为用户名加后缀
        return userName + "." + suffix;
    }







}
