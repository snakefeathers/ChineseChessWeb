package com.mosheyu.controller;

import com.mosheyu.domain.User;
import com.mosheyu.service.UserService;
import com.sun.deploy.net.HttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Map;


@Controller
@RequestMapping("/user")
public class UserController {

    @Resource(name = "UserService")
    private UserService userService;


    @RequestMapping("/login")
    public ModelAndView loginCheck(@RequestParam(value = "username", required = true) String username,
                                   @RequestParam(value = "password", required = true) String password,
                                   HttpServletResponse response, HttpSession httpSession
                                   ) {
        ModelAndView modelAndView = new ModelAndView();


        System.out.println("后台接收数据" + "用户名：" + username + "\n密码：" + password + "\n");

        if (userService.loginCheck(username, password)) {              //判断用户是否存在
            //用户存在的处理
            User user = userService.findOne(username, password);

            httpSession.setAttribute("userName", user.getUserName());

            Cookie cookie = new Cookie("userName", user.getUserName());
//            设置cookie作用域
            cookie.setPath("/");
//             设置存在时间为5分钟
            cookie.setMaxAge(5 * 60);

            Cookie cookie1 = new Cookie("userType", Integer.toString(user.getUserType()));
//            设置cookie作用域
            cookie1.setPath("/");
//             设置存在时间为5分钟
            cookie1.setMaxAge(5 * 60);

            response.addCookie(cookie);
            response.addCookie(cookie1);
            modelAndView.setViewName("redirect:/index.html");
        } else {
            //用户不存在的处理
            //暂且直接跳转到主页
            modelAndView.setViewName("redirect:/register.html");
        }
        return modelAndView;
    }



    @RequestMapping("/register")
    public ModelAndView userRegister(@RequestParam(value = "username", required = true) String username,
                                     @RequestParam(value = "password", required = true) String password,

                                     HttpServletResponse response){
        ModelAndView modelAndView = new ModelAndView();


        System.out.println("后台接收数据" + "用户名：" + username + "\n密码：" + password + "\n");

        if (!userService.userExists(username)) {              //判断用户是否存在
            //用户不存在就注册
            //注册用户
            userService.userRegister(username, password);
            //转为登录界面
            modelAndView.setViewName("redirect:/login.html");
        } else {
            //用户存在的处理
            //暂且直接跳转到注册页
            modelAndView.setViewName("redirect:/register.html");
        }
        return modelAndView;


    }


    //根据用户名，返回用户具体信息
    @RequestMapping(value = "/showByUserId")
    @ResponseBody
    public User userShow(HttpServletRequest request, @CookieValue(value="userName")String userName){
        User user = userService.findOneByName(userName);
        user.setUserPassword("****");
        return user;
    }

    //根据用户名，修改具体信息
    @RequestMapping(value = "/update")
    public ModelAndView userUpdate(HttpServletRequest request,User user,@RequestParam("modalUserPhoto") MultipartFile file){
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
        modelAndView.setViewName("redirect:/centerPersonage.html");
        return modelAndView;
    }


    // 修改用户名
    @RequestMapping(value = "/updatePass")
    @ResponseBody
    public boolean updateUserPassword(@RequestBody Map<String,String> data){
        String userName = data.get("userName");
        String userPassword = data.get("userPassword");
        boolean b = userService.updateUserPassword(userName,userPassword);
        return b;
    }





    @RequestMapping("/photos")
    public String findUserPhotoUsrl(@RequestParam(value = "id", required = true) String username,HttpServletRequest request ) throws IOException {
        System.out.println("返回图片");
        User user = userService.findOneByName(username);

//        String path = request.getServletContext().getRealPath("/photos/");

//        java.io.FileNotFoundException: \CP\photos\admin.jpg (系统找不到指定的路径。)
//        String path = request.getContextPath()+"/photos/"+user.getPhotoUrl();
//
//        System.out.println(path);
//        File file = new File(path);
//        FileInputStream inputStream = new FileInputStream(file);
//        byte[] bytes = new byte[inputStream.available()];
//        inputStream.read(bytes, 0, inputStream.available());
//        return bytes;
        return "redirect:/photos/"+ user.getPhotoUrl();
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