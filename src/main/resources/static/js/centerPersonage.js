
let personUrl = new Array("/user","/invitation","/discuss");


function jump(ind_ele){
    //获取数据
    $.ajax({
        url: objectUrl + personUrl[ind_ele] + "/showByUserId",
        type: "POST",
        async: true,
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            if (data != null) {
                //根据索引调用对应的函数，将数据渲染进页面
                switch (ind_ele){
                    case 0:
                        personageShow(data);
                        break;
                    case 1:
                        // setTimeout("console.log('wait')",0);
                        invitationShow(data);
                        break;
                    case 2:
                        discussShow(data);
                        break;
                    default:break;
                }
            }else {
                console.log("没有获取数据")
            }
        }
    });
}
//个人信息展示
function personageShow(data){

    console.log("执行 personageShow 方法");
    $("#formUserName")[0].innerText = data.userName;
    $("#formUserPhoto")[0].src = "http://localhost:8080/CP/photos/"+ data.photoUrl;

    //设置性别文本
    $("#formUserSex")[0].innerText =getSex(data.sex);
    //设置性别的data-value
    $("#formUserSex")[0].dataset.value = data.sex;
    $("#formUserAge")[0].innerText = data.age;
    $("#formUserIntro")[0].innerText = data.introduction;
}
//帖子展示
function invitationShow(data){
    console.log("执行 invitationShow 方法");
    console.log(data);
    let trHtml = $("#inviTable tbody tr")[0].innerHTML;
    $("#inviTable tbody")[0].innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        $("#inviTable tbody")[0].innerHTML += trHtml;
    }
    for (let j = 0; j < data.length; j++) {
        // 标题               invitationTitle: "测试标题1606"
        $("#inviTable tbody tr")[j].children[0].innerText = data[j].invitationTitle;
        // 正文部分             invitationBody: "测试内容1606\n修改测试1106"
        $("#inviTable tbody tr")[j].children[1].innerText = data[j].invitationBody.substr(0,60);
        // 创建时间              creationTime: "2021-10-29T04:06:35.000+00:00"
        $("#inviTable tbody tr")[j].children[2].innerText = formatTimestamp(new Date(data[j].creationTime));
        // 状态                   status: 0
        $("#inviTable tbody tr")[j].children[3].innerText = statusToStr(data[j].status);
        $("#inviTable tbody tr")[j].children[3].dataset.status = data[j].status;

        // invitationId: "59d22dfae54b3ebc76c610ff7d2e7b94"
        $("#inviTable tbody tr")[j].children[4].children[0].dataset.id = data[j].invitationId;
        $("#inviTable tbody tr")[j].children[4].children[1].dataset.id = data[j].invitationId;
    }
}

//评论展示
function discussShow(data){
    console.log("执行 discussShow 方法");
    console.log(data);
    let trHtml = $("#discussTable tbody tr")[0].innerHTML;
    $("#discussTable tbody")[0].innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        $("#discussTable tbody")[0].innerHTML += trHtml;
    }
    for (let j = 0; j < data.length; j++) {

        $("#discussTable tbody tr")[j].children[0].innerText = data[j].inviationTitle;
        // 评论内容                 discussText: "对对对，你说的都对。"
        $("#discussTable tbody tr")[j].children[1].innerText = data[j].discussText;
        // 创建时间                 creationTime: 1633690549
        $("#discussTable tbody tr")[j].children[2].innerText = formatTimestamp(new Date(data[j].creationTime));
        // status: 0
        $("#discussTable tbody tr")[j].children[3].innerText = statusToStr(data[j].status);
        $("#discussTable tbody tr")[j].children[3].dataset.status = data[j].status;

        // discussId: "7a1f10c5fa0a8020eae263fc07a4bdef"
        $("#discussTable tbody tr")[j].children[4].children[0].dataset.id = data[j].discussId;
    }
}





let typeUrl = ["","/invitation","/discuss"]


function invitationDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(1,thisEle.dataset.id);
}
function discussDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(2,thisEle.dataset.id);
}

function deleteById(indDele,eleId){

    $.ajax({
        url: objectUrl + typeUrl[indDele] + "/deleteById",
        type: "POST",
        async: true,
        data: JSON.stringify({id: eleId}),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            console.log(data);
            if (data) {
                document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a")[indDele].click();
            }else {
                console.log("操作失败");
            }
        }
    });
}





function invitationUpdate(btnUpdateInvi){
    let invitationId = btnUpdateInvi.dataset.id;
    $("#inputId")[0].value =invitationId;
    $("#inputTitle")[0].value = btnUpdateInvi.parentNode.parentNode.children[0].innerHTML;
    $("#inputBody")[0].value = btnUpdateInvi.parentNode.parentNode.children[1].innerHTML;

    $('#updateInvi').modal('show');
}




function updateInvitation(){
    let invitationId = $("#inputId")[0].value;
    let inputTitle = $("#inputTitle")[0].value;
    let invitationBody = $("#inputBody")[0].value;
    $.ajax({
        url: objectUrl + "/invitation" + "/inviUpdate",
        type: "POST",
        async: true,
        data: JSON.stringify({
            'invitationId': invitationId,
            'invitationTitle':inputTitle,
            'invitationBody':invitationBody

        }),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        // dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            console.log(data);
            if (data) {
                $('#updateInvi').modal('hide');
                document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a")[1].click();
            }else {
                console.log("操作失败");
            }
        }
    });
}







//将性别的数字转为对应的字符串
function getSex(userSex){
    switch (userSex){
        case 0:
            return "隐藏";
        case 1:
            return "男";
        case 2:
            return "女";
    }
}



//  将后台的日期格式化输出
function formatTimestamp(dateTime){
    let yearStr = dateTime.getFullYear();
    let mouthStr = dateTime.getMonth();
    let dayStr = dateTime.getDate();
    let hourStr = dateTime.getHours();
    let minuteStr = dateTime.getMinutes();
    return yearStr + "-" + mouthStr + "-" + dayStr + " " + hourStr + ":" +  minuteStr;
}

//   存储情况转字符串
function statusToStr(status){
    switch (status){
        case 0:
            return "正常";
            break;
        default:
            return "归档";
            break;
    }
}

//   用户类型转字符串
function userStatusToStr(status){
    switch (status){
        case 0:
            return "普通用户";
            break;
        default:
            return "管理员";
            break;
    }
}

//   用户性别转字符串
function userSexToStr(userSex){
    let userSexStr = "";
    switch (userSex){
        case 0:
            userSexStr = '隐藏';
            break;
        case 1:
            userSexStr = '男';
            break;
        case 2:
            userSexStr = '女';
            break;
    }
    return userSexStr;
}
