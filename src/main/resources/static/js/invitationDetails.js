console.log("invitation.js文件导入");

let writerId;
//请求帖子详情数据
function get_invitation(invitation_id){
    $.ajax({
        url:objectUrl + hrefAndUrl[2]+"/invitationShow"+"?id="+invitation_id,
        type:"POST",
        async:true,
        // data: JSON.stringify({'id':invitation_id }),
        contentType:"application/json;charset=UTF-8",
        dataType:'json',
        success:function (data){
            //#region  数据示例
            // {
            //     "invitationId": "7a1f10c5fa0a8020eae263fc07a4bded",
            //     "invitationTitle": "标题测试002",
            //     "creationTime": 1632153562000,
            //     "discussNum": 0,
            //     "pageView": 0,
            //     "invitationBody": "帖子正文部分测试。",
            //     "writerId": "墨折羽",
            //     "status": 1
            // }
            //#endregion
            invitation_show(data);
        },
        error(e){
            console.log(e);
            // alert(e);
        }
    });
}
//帖子数据插入页面中
function invitation_show(data){
    // $(".invitation_title")[0].data("inviId", data.invitationId);
    $(".invitation_title")[0].dataset.inviid = data.invitationId;
    $(".invitation_title")[0].innerHTML = data.invitationTitle;
    $(".invitation_body")[0].innerHTML = data.invitationBody;
    // $("#btnGroup")[0].data("writer", data.writerId);
    $("#btnGroup")[0].dataset.writer = data.writerId;


    //根据登录状态，决定帖子是否可以编辑和删除
    if ($.cookie(userNameConk) !=undefined && data.writerId == $.cookie(userNameConk)) {
        console.log("确认用户拥有帖子权限");
        $("#btnGroup")[0].style.display = "block";
    } else {
        console.log("确认用户无权限");
        $("#btnGroup")[0].style.display = "none";
    }
    // console.log(data.invitationId);
    // console.log(data.creationTime);
    // console.log(data.invitationTitle);
    // console.log(data.discussNum);
    // console.log(data.invitationBody);
    // console.log(data.pageView);
    // console.log(data.writerId);
    // console.log(data.status);
}

//请求帖子对应的评论数据
function get_discuss(invitation_id){
    $.ajax({
        url:objectUrl + hrefAndUrl[2] + "/discuss" + "?id=" + invitation_id,
        type: "GET",
        async: true,
        contentType: "application/json;charset=UTF-8",
        dataType: 'json',
        success:function (data){
            //获取评论列表
            //#region  数据示例
            // {
            // 0:
            // creationTime: 1633690549
            // discussId: "7a1f10c5fa0a8020eae263fc07a4bded"
            // discussText: null
            // invitationId: null
            // replyId: "7a1f10c5fa0a8020eae263fc07a4bdec"
            // status: 0
            // userName: "魔蛇羽"
            // userVIP: null
            //     [[Prototype]]: Object
            // 1:
            // creationTime: 1633690549
            // discussId: "7a1f10c5fa0a8020eae263fc07a4bdee"
            // discussText: null
            // invitationId: null
            // replyId: "0"
            // status: 0
            // userName: "魔蛇羽"
            // userVIP: null
            //     [[Prototype]]: Object
            // 2:
            // creationTime: 1633690549
            // discussId: "7a1f10c5fa0a8020eae263fc07a4bdef"
            // discussText: null
            // invitationId: null
            // replyId: "0"
            // status: 0
            // userName: "魔蛇羽"
            // userVIP: null
            // }
            //#endregion
            // console.log(data);
            discuss_show(data);
        },
        error(e) {
            console.log(e);
            // alert(e);
        }
    });
}
//评论数据插入页面中
function discuss_show(data) {
    console.log("渲染评论");
    //获取媒体对象列表
    let media_list =  $(".media-list .media")[0].outerHTML;
    //生成页面media元素
    $(".media-list")[0].innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        $(".media-list")[0].innerHTML += media_list;
    }
    //数据注入元素中
    for (let i = 0; i < data.length; i++) {
        // console.log(i);
        // console.log( $(".media-list .media a img")[i]);
        $(".media-list .media a img")[i].alt = data[i].userName;
        // $(".media-list .media a img")[i].src =
        // $(".media-list .media a img")[i].src = "http://localhost:8080/CP/photos/"+data[i].user.
        $(".media-list .media .media-body h5")[i].innerText = data[i].userName;
        $(".media-list .media .media-body p")[i].innerText = data[i].discussText;


        // console.log(data[i].creationTime);
        // console.log(data[i].discussId);
        // console.log(data[i].discussText);
        // console.log(data[i].invitationId);
        // console.log(data[i].replyId);
        // console.log(data[i].status);
        // console.log(data[i].userName);
        // console.log(data[i].userVIP);
        // console.log($(".media-list .media .media-body p")[1].innerText);
    }
}











