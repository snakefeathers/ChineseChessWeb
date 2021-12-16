//项目地址
const objectUrl = "http://localhost:8080/CP";

//定义链接数组
let hrefAndUrl = new Array("/index","/board","/conversation","/consult");



//部分重复使用的变量

//登录按钮ID
let loginButtonId = "nav_li_login";
//下拉框ID
let comboboxId = "nav_li_down";
//退出按钮ID
let exitButtonId = "nav_li_a_exit";

//用户名对应的cookie名
let userNameConk = 'userName';

$.cookie('userName')

//#region   登录按钮的显示和隐藏，退出功能

//判断用户是否登录
function isLogin(){
    //根据cookie判断是否登录
    if($.cookie(userNameConk) != null && $.cookie(userNameConk) != undefined){
        // if(userName != null && userName != undefined){
        //     return true;
        // }else {
        //     return false;
        // }
        return true;
    }else {
        return false;
    }

}

//判断是否登录，并根据情况改变页面布局，将用户名注入到页面中。
function loginBtnDis(status) {
    //判断用户是否登录，改变登录按钮布局
    if (status) {
        // 将文本设置为cookie中的用户名
        $("#userNameShow")[0].innerText = $.cookie(userNameConk);
        //隐藏登录按钮，显示下拉框
        document.getElementById(loginButtonId).style.display = "none";
        document.getElementById(comboboxId).style.display = "block";
    } else {
        //隐藏下拉框,显示登录按钮
        document.getElementById(comboboxId).style.display = "none";
        document.getElementById(loginButtonId).style.display = "block";
    }
}

//退出按钮的单击事件    移除cookie，并隐藏下拉菜单
function removeCookie() {
    $.cookie(userNameConk, null, {
        path : '/',
        expires: -1
    });
    //隐藏下拉框,显示登录按钮
    document.getElementById(comboboxId).style.display = "none";
    document.getElementById(loginButtonId).style.display = "block";


    window.location.href = "http://localhost:8080/CP";
}

//#endregion



//时间戳转时间函数
function timestampToTime(timestamp){
    //时间戳转日期对象
    let time = new Date(timestamp);
    //获取年份
    let year = time.getFullYear();
    //获取月份
    let month = time.getMonth();
    //获取日期
    let day = time.getDay();
    return year+"."+month+"."+day;
}


//#region 导航条超链接添加单击事件
//初始化时，将第一个active激活，超链接里添加单击事件
function active_nav(){
    //获取导航条中ul下的li元素列表
    let li_list = $("nav ul:first-child.nav.navbar-nav li");
    //将第一个li元素添加class值：active
    li_list[0].class += " active";
    //获取导航条中ul下的li下的a元素列表
    let li_a_list = document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a");
    //每个元素添加单击方法
    for (let i = li_a_list.length-1; i >= 0; i--) {
        li_a_list[i].onclick =containerSwitch;
    }
    //初始化按钮和主体样式
    aEleDIsplay(0);
    conEleDislay(0);
}
//构思单击事件
function containerSwitch(){
    //获取本元素是第几个元素
    let ind_ele = $("nav ul:first-child.nav.navbar-nav li a").index(this);
    aEleDIsplay(ind_ele);
    conEleDislay(ind_ele);
    jump(ind_ele);
}
//将导航条的指定按钮添加激活样式
function  aEleDIsplay(ind_ele){
    let li_list =$("nav ul:first-child.nav.navbar-nav li");
    //去除所有的li的激活状态
    for (let li_ele of li_list){
        li_ele.classList.remove("active");
    }
    //将对应索引的nav ul li添加class值:active
    li_list[ind_ele].classList.add("active");
}
//将指定模块显示
function conEleDislay(ind_ele){
    let con_list = $(".container");
    //将所有主体部分隐藏
    for (let con_ele of con_list){
        con_ele.style.display = "none";
    }
    //将指定索引的主体部分显示
    con_list[ind_ele].style.display = "block";
}

//#endregion






//判断是否登录
let login_status = isLogin();
//改变页面登录按钮状态
loginBtnDis(login_status);


//由于项目名，文件名等会变动，因此将链接都提取出来，方便以后查询和修改

//修改登录的链接
$("#"+loginButtonId).attr('href',"http://localhost:8080/CP/login.html");

//给退出按钮添加退出功能，
document.getElementById(exitButtonId).onclick =  removeCookie;


