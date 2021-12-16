
let webSocket = null;
let url = null;

//发送者
let userName = null;
//接收者
let receiver = null;

//现在的窗口，是media-list对象
let mediaWind = null;


userName = $.cookie("userName");

if(isLogin()){
    console.log(userName);
    connect();
}

//根据类名，选择用户选项卡现有列表
let userEleList = $("#userList .list-group-item");


/**
 * 创建连接
 */
function connect() {
    // 判断协议 - http or https
    function isUrl() {
        if (window.location.protocol == 'http:') {
            return 'ws://' + window.location.host + "/CP" + "/msg";
        } else {
            return 'wss://' + window.location.host + "/CP" + "/msg";
        }
    }
    url = isUrl();

    console.log("链接url为:" + url);
    // 建立连接
    if (webSocket == null) {
        webSocket = new WebSocket(url);
    }

    // 连接成功提示
    webSocket.onopen = function (evt) {
        console.log('Info: 连接成功.');
    };
    // 连接失败提示
    webSocket.onerror = function () {
        console.log('Info: 连接失败.');
        //发送按钮禁用
    };
    // 连接断开提示
    webSocket.onclose = function (event) {
        console.log('Info: 连接断开.');
        console.log(event.data);
        //发送按钮禁用

    };
// 消息举例
// 接收到消息,消息类型：1
// websocket.js:52 广播信息：[admin, mosheyu]
// 接收来自服务器的消息
    webSocket.onmessage = function (event) {
        let msg =  JSON.parse(event.data);
        let msgType = msg.msgType;
        console.log("接收到消息,消息类型："+msgType);
        console.log("--------------------");
        signalSwitchOperation(msgType,msg);
    };


}


//全体消息展示
function msgToAllShow(msg){
    //判断是否存在该聊天窗口
    let mediaListList = $(".media-list");
    let mediaListEle = null;
    //如果有，就获取
    for (let i=0;i<mediaListList.length;i++){
        if (mediaListList[i].dataset.name == "MOSHEYUALL"){
            mediaListEle = mediaListList[i];
        }
    }
    //如果没有，就创建
    if (mediaListEle == null || mediaListEle == undefined){
        mediaListEle = createMediaList("MOSHEYUALL")
        $("#chatWidow")[0].appendChild(mediaListEle);
    }

    let mediaEle = createMedia(msg.sender,msg.msgString,true);
    mediaListEle.append(mediaEle);

}

//用户消息展示
function msgToOneShow(msg){
    //判断是否存在该聊天窗口
    let mediaListList = $(".media-list");
    let mediaListEle = null;
    console.log($("#chatWidow .media-list[data-name= '" + msg.sender + "']"));
    if ($("#chatWidow .media-list[data-name='" + msg.sender + "']").length > 0) {
        //如果有，就获取

        mediaListEle = $("#chatWidow .media-list[data-name='" + msg.sender + "']")[0];

        console.log("获取");
        console.log(mediaListEle);
    }else {
        mediaListEle = createMediaList(msg.sender)
        $("#chatWidow")[0].appendChild(mediaListEle);

        console.log("创建");
        console.log(mediaListEle);
    }

    console.log("添加media对象前");
    console.log(mediaListEle);
   //   创建media对象并添加
    let mediaEle = createMedia(msg.sender,msg.msgString,true);
    mediaListEle.appendChild(mediaEle);


    console.log("添加media对象后");
    console.log(mediaListEle);

    mediaListEle = mediaListByDisplay();

    if (mediaListEle == null || mediaListEle.dataset.name != msg.sender) {
        console.log("消息隐藏");
        // 结尾添加徽章
        addBadge(msg.sender);
    }


}




// 获取当前显示的medialist
function mediaListByDisplay(){
    let mediaListEle = null;
    if ($("#chatWidow .media-list[display='block']").length > 0){
        mediaListEle = $("#chatWidow .media-list[display='block']")[0];
    }
    return mediaListEle;
}

// 获取  用户的mediaList
function mediaListByUserName(sender){
    let mediaListEle = null;
    if ($("#chatWidow .media-list[data-name='" + sender + "']").length > 0) {
        mediaListEle = $("#chatWidow .media-list[data-name='" + sender + "']")[0];
    }
    return mediaListEle;
}




//  根据用户名获取对应的a用户列表下的元素对象
function userListFindByUsername(senderName){
    let senderNameEle = null;
    if ($("#userList .list-group-item[data-name='" + senderName + "']").length > 0) {
        // senderNameEle = $("#userList .list-group-item[display='block']")[0];
        senderNameEle = $("#userList .list-group-item[data-name='" + senderName + "']")[0];
    }
    return senderNameEle;
}
$("#userList .list-group-item[data-name='mosheyu']")[0];

//添加徽章    判断是否是打开的会话   是的，就不加，不是，就加。
// 加的时候判断是否已经有了？有了就加数字，没有，就设为1
function addBadge(sendName){
    let openStatus = false;

    //是否打开会话
    //判断目前是哪个会话？
    let mediaListEle = mediaListByDisplay();
    if (mediaListEle != null || mediaListEle != undefined){
        if (mediaListEle.dataset.name == sendName){
            return;
        }
    }
    let senderNameEle = userListFindByUsername(sendName);
    //   获取发送者的标签元素
    if (senderNameEle != null && senderNameEle != undefined){
        //   如果没有徽章，就添加
        if (senderNameEle.querySelector("span") == null || senderNameEle.querySelectorAll("span").length <= 0){
            let badgeEle = document.createElement("span");
            badgeEle.classList.add("badge");
            badgeEle.dataset.number = 1;
            badgeEle.innerText = 1;
            senderNameEle.appendChild(badgeEle);

        }else {
            console.log(senderNameEle.querySelector("span"));
            //   如果有徽章，数字加1
            let newsNum = senderNameEle.querySelector("span").dataset.number;
            newsNum = Number.parseInt(newsNum) + 1;
            senderNameEle.querySelector("span").innerText = newsNum;
            senderNameEle.querySelector("span").dataset.number = newsNum;
        }
    }else {
        console.log("未获取到该用户");
    }

}




//用户名列表数据转为数组
function stringToArray(msgString){
    msgString = msgString.replace("[", "");
    msgString = msgString.replace("]", "");
    msgString = msgString.replace(" ", "");
    if (msgString.indexOf(",")>0){
        return msgString.split(",");
    }else {
        let userNameList = new Array();
        userNameList.push(msgString);
        console.log(userNameList);
        return userNameList;
    }
}


initLiEle();

//给所有选项卡添加单击事件
function initLiEle(){
    let liEles = $("#userList .list-group-item");
    for (let i=0;i<liEles.length;i++){
        liEles[i].onclick = liEleOnCLick;
    }
    //启用发送按钮

}


//用户发送消息
function userNewsSend(){
    //读取内容区域
    let msgString = $("#userMsgString")[0].value;
    //内容区域清空
    $("#userMsgString")[0].value = "";

    //前端对应的mediaList中添加对象
    mediaWind.appendChild(createMedia(userName,msgString,false));

    let msg = {
        "msgType":3,
        "sender":userName,
        "receiver":receiver,
        "msgString":msgString
    };
    if(mediaWind.dataset.name =="MOSHEYUALL"){
        msg.msgType=2;
    }else if(mediaWind.dataset.name =="MOSHEYUADMIN"){
        msg.receiver ="admin";
    }else{

    }

    //发送给后端
    webSocket.send(JSON.stringify(msg));
}





//选项卡的单击事件
function liEleOnCLick(){
    //禁用状态不生效
    if (this.className.indexOf("disabled") >= 0){
        return;
    }
    liRemoveActive();
    console.log("单击选项卡");
    this.classList.add("active");
    //全局变量接受者赋值
    receiver = this.dataset.name;

    //   我再也不取 innerHTML 了！！！
    // ！！

    //显示当前接收者
    $("#receiverTitle")[0].innerHTML = receiver;
    //聊天窗口下的所有媒体对象设为隐藏
    let mediaLIst= $("#chatWidow .receiverMdLi");
    for (let i=0;i<mediaLIst.length;i++){
        mediaLIst[i].style.display = "none";
    }
    console.log(this);
    console.log(this.dataset.name);

    //  将当前显示的聊天窗口隐藏
    mediaWind = mediaListByDisplay();
    if (mediaWind != null && mediaWind != undefined) {
        mediaWind.style.display = "none";
    }
    mediaWind = mediaListByUserName(this.dataset.name);
    if (mediaWind != null){
        mediaWind.style.display = "block";
    }else {
        mediaWind =  createMediaList(this.dataset.name);
        mediaWind.style.display = "block";
        $("#chatWidow")[0].appendChild(mediaWind);
    }

    // //与用户名相同的聊天窗口展示
    // for (let i=0;i<mediaLIst.length;i++){
    //     if (mediaLIst[i].dataset.name == this.dataset.name){
    //         mediaWind = mediaLIst[i];
    //         mediaLIst[i].style.display = "block";
    //     }
    // }
    // //没有该媒体对象，创建一个。
    // if (mediaWind == null || mediaWind == undefined){
    //     mediaWind =  createMediaList(this.dataset.name);
    //     mediaWind.style.display = "block";
    //     $("#chatWidow")[0].appendChild(mediaWind);
    // }




    // //提示现在用户
    // $("#receiverTitle")[0].innerHTML = receiver;

    //去除末尾的徽章   如果有的话。
    if(this.querySelectorAll("span").length > 0){
        this.removeChild(this.querySelectorAll("span")[0]);
    }


    //  如果按钮被禁用，启用按钮
    if($("#btnSend")[0].classList.contains("disabled")){
        //去除发送按钮的禁用状态
        $("#btnSend")[0].classList.remove("disabled");
    }

}



userListHtmlUpdate([]);

//  收到后台传来的在线人数   读取在线人数，渲染在线选项卡
function userListHtmlUpdate(userNameList) {

    //修改HTML结构
    //保留两个
    let listHead = [userEleList[0], userEleList[1]];
    $("#userList")[0].innerHTML = "";
    //添加这两个
    $("#userList")[0].appendChild(listHead[0]);
    $("#userList")[0].appendChild(listHead[1]);
    $("#userList")[0].innerHTML += "<hr>";


    //如果在线用户大于1，就渲染   1代表自己，2代表还有一个人
    if (userNameList.length > 1) {
        let  userHtmlEle = null;
        for(let i= 0;i<userNameList.length; i++){
            //不添加本人的选项卡
            if (userNameList[i] != userName){
                userHtmlEle = document.createElement("a");
                userHtmlEle.classList.add("list-group-item");
                userHtmlEle.innerHTML = userNameList[i];
                userHtmlEle.dataset.name = userNameList[i];
                $("#userList")[0].appendChild(userHtmlEle);
            }
        }
        // 渲染结束
    }else{
       if (isLogin()){
           $("#userList")[0].innerHTML +="   <a href=\"#\" class=\"list-group-item \">"+" 无人在线"+" </a>";
       }else {
           $("#userList")[0].innerHTML +="   <a href=\"#\" class=\"list-group-item \">"+" 请先登录"+" </a>";
       }
    }

    //刷新li列表
    userEleList = $("#userList .list-group-item");
    //绑定单击事件
    initLiEle();
    //刷新选项卡状态
    statusUpdateEleDisabled(isLogin(),false,userNameList.length);

}




//修改禁用状态    参数：登录状态，管理员登录状态，用户人数
function statusUpdateEleDisabled(loginStatus,adminStatus,userNum){
    console.log("处理选项卡禁用");
    //所有选项卡添加禁用
    for (let i = 0; i < userEleList.length; i++) {
        userEleList[i].classList.remove("disabled");
        userEleList[i].classList.add("disabled");
        // console.log(userEleList[i].classList);
    }
    //用户登录了
    if (loginStatus){
        //启用选项卡
        userEleList[0].classList.remove("disabled");
        //判断管理员是否在线
        if (adminStatus){
            userEleList[1].classList.remove("disabled");
        }
        //判断用户选项卡是否显示
        if (userNum >1){
            for (let i = 2; i < userEleList.length; i++) {
                userEleList[i].classList.remove("disabled");
            }
        }
    } else {
        //没有登录  --- 不处理
    }
}









// 创建信息发送函数
function msgSend(msgType,sender,receiver,msgString){
    let msg = {
        "msgType":msgType,
        "sender":sender,
        "receiver":receiver,
        "msgString":msgString
    };
    //发送给后端
    webSocket.send(JSON.stringify(msg));
}







//创建提示
function createBadge(num){
    let baderEle = document.createElement("span");
    baderEle.classList.add("badge");
    baderEle.innerHTML = num;
}


//创建媒体对象列表  参数为  接收者名称
function  createMediaList(receiverName){
    let mediaListEle = document.createElement("div");
    mediaListEle.classList.add("media-list");
    mediaListEle.classList.add("receiverMdLi");
    mediaListEle.style.display = "none";
    mediaListEle.dataset.name = receiverName;

    return mediaListEle;
}

// createMedia("mosheyu","测试文本","media-left","media-right");
//创建媒体对象元素  参数分别为  用户名，内容，图片位置，内容位置
function createMedia(headingName,bodyText,imgDirection){
    //media元素
    let mediaEle = document.createElement("div");
    mediaEle.classList.add("media");
    //图片的包装盒
    let mediaLeft = document.createElement("div");
    //图片元素
    let imgEle = document.createElement("img");
    //内容部分包装盒
    let mediaRight = document.createElement("div");
    //内容部分标题
    let h5Ele =  document.createElement("h5");
    h5Ele.classList.add("media-heading");
    //内容
    let bodyEle =  document.createElement("div");
    bodyEle.classList.add("media-body");

    //真  左  假  右
    if (imgDirection){
        mediaLeft.classList.add("media-left");
        mediaRight.classList.add("media-left");
    }else {
        mediaLeft.classList.add("media-right");
        mediaRight.classList.add("media-right");

    }
    //图片位置
    imgEle.src = " http://localhost:8080/CP/user/photos?id="+headingName;
    //用户名
    h5Ele.innerText = headingName;
    //内容
    bodyEle.innerText = bodyText;



    mediaLeft.appendChild(imgEle);

    mediaRight.appendChild(h5Ele);
    mediaRight.appendChild(bodyEle);

    //真  左  假  右
    if (imgDirection){
        mediaEle.appendChild(mediaLeft);
        mediaEle.appendChild(mediaRight);
    }else {
        mediaRight.style.textAlign = "right";
        mediaEle.appendChild(mediaRight);
        mediaEle.appendChild(mediaLeft);
    }



    return mediaEle;
}



//单击后移除所有选项卡的active值。
function liRemoveActive(){
    console.log("移除选项卡激活效果");
    let liEles = $("#userList .list-group-item");
    for (let i=0;i<liEles.length;i++){
        liEles[i].classList.remove("active");
    }
}

