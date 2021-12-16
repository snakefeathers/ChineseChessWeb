console.log("index.js文件导入");



if (isLogin()){
    console.log("链接修改");
    if ($.cookie("userType")  == 1){
        $("#btnPersonage")[0].href = "http://localhost:8080/CP/centerAdmin.html";
    }else {
        $("#btnPersonage")[0].href = "http://localhost:8080/CP/centerPersonage.html";
    }
}


//切换页面时，请求数据，并调用函数渲染页面
function jump(ind_ele){

    let indexAndUrl = new Array("/admin","/conversation","/conversation","/conversation");
    //获取数据
    $.ajax({
        url: objectUrl + indexAndUrl[ind_ele] + "/show",
        type: "POST",
        async: true,
        data: JSON.stringify({userNameTest: "admin", userPasswordTest: "123"}),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            if (data != null) {
                //根据索引调用对应的函数，将数据渲染进页面
                switch (ind_ele){
                    case 0:
                        announcementShow(data);
                        break;
                    case 1:
                        chineseChessShow(data);
                        break;
                    case 2:
                        // setTimeout("console.log('wait')",0);
                        invitationShow(data);
                        break;
                    case 3:
                        connect('/websocketTest');
                        consultShow(data);
                        break;
                    default:break;
                }
            }else {
                console.log("没有获取数据")
            }
        }
    });
}


















//将JSON数据转为对象数组
function dataToInvitations(data) {
    let invitationArray = new Array();
    for (let i = 0; i < data.length; i++) {
        invitationArray[i] = data[i];
        console.log(invitationArray[i]);
    }
}



//  公告模块显示
function announcementShow(data){
    console.log("announcementShow");

    //路径拼接
    let url_invitation = objectUrl + "/conversation" + "/details" + "?id=";

    let liELeList = $("#announcementList")[0].children;
    for (let i =0;i<data.length;i++){
        liELeList[i].innerText = data[i].invitationTitle;
        liELeList[i].datasetId = data[i].invitationId;
        liELeList[i].href = url_invitation + data[i].invitationId;
    }
}



//象棋模块主体展示
function chineseChessShow(data){
    console.log("chineseChessShow");
    // dataBShow = data;
    // console.log(data);

}
//论坛模块主体展示
function invitationShow(data){
    console.log("invitationShow开始执行。");
    //构建页面

    //数据个数
    let big_num = data.length;
    //获取帖子显示元素的HTML结构
    let invitation_big_HTML = $("#conversationBody .invitation_big")[0].outerHTML;

    //清空页面主体部分
    conversationBody.innerHTML = "";

    //添加按钮“添加帖子
    let btnEle = document.createElement('a');
    btnEle.className = "btn btn-default btnAddInvitation";
    btnEle.href = "http://localhost:8080/CP/invitation/add";
    btnEle.innerText = "添加帖子";
    console.log(btnEle);
    document.getElementById("conversationBody").appendChild(btnEle);
    // $("#conversationBody .invitation_big").appendChild(btnEle);
    console.log($("#conversationBody .invitation_big"));



    //构建HTML页面
    for (let i = 0;i<big_num;i++){
       conversationBody.innerHTML += invitation_big_HTML;
   }

    //获取元素
    //帖子展示块Id
    let invitation_big = $(".invitation_big");
    //查看全文的按钮
    let btu_Id = $(".btn.btn-primary.btn-md.pull-right");
    let invitation_title = $(".invitation_title");
    let invitation_body = $(".invitation_body");
    let invitation_creationTime = $(".invitation_creationTime");
    let invitation_pageView = $(".invitation_pageView");

    //路径拼接
    let url_invitation = objectUrl + "/conversation" + "/details" + "?id=";
    //赋值
    for (let i = 0; i < invitation_big.length; i++) {
        invitation_title[i].innerText = data[i].invitationTitle;
        invitation_body[i].innerText = data[i].invitationBody;
        invitation_creationTime[i].innerText = timestampToTime(data[i].creationTime);
        invitation_pageView[i].innerText = "观看人数" + data[i].pageView + "人";
        //给每个单击按钮添加跳转链接
        btu_Id[i].href = url_invitation + data[i].invitationId;
    }

}


//咨询模块主体展示
function consultShow(data){
    console.log("consultShow");
    // dataBShow = data;
    // console.log(data);

}




//————————————————————————不需要修改
//根据首页导航条的a元素的ID，更改对应的链接
// $('#nav_ul_a1').attr('href',page_fistt_href);
// $('#nav_ul_a2').attr('href',page_second_href);
// $('#nav_ul_a3').attr('href',page_third_href);
// $('#nav_ul_a4').attr('href',page_fourth_href);
