let personUrl = new Array("/board","/invitation","/discuss","/user","/personal");


function jump(ind_ele){
    //获取数据
    $.ajax({
        url: objectUrl + "/admin" + personUrl[ind_ele],
        type: "POST",
        async: true,
        data: JSON.stringify({pageNo:1}),
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            if (data != null) {
                //根据索引调用对应的函数，将数据渲染进页面
                switch (ind_ele){
                    case 0:
                        boardPageShow(data);
                        break;
                    case 1:
                        invitationPageShow(data)
                        break;
                    case 2:
                        discussPageShow(data)
                        break;
                    case 3:
                        userPageShow(data)
                        break;
                    case 4:
                        personalPageShow(data)
                        break;
                    default:break;
                }
            }else {
                console.log("没有获取数据")
            }
        }
    });
}


// "sssssssssssssss?23,44,s,f|33,44,t,y|".split("?")[0].length
//     "?23,44,s,f|33,44,t,y|".split("?")[0].length
// 0:

// let dataTest = new Date("1636256898203");
// let dataTest = new Date(1636256898203);


// boardDetail: "sssssssssssssss?23,44,s,f|33,44,t,y|"
// boardId: "33a1f10c5fa0a8020eae263fc07a4bde"
// creationTime: 1637073626
// elapsed: 350
// status: 0
// userNameA: "admin"
// userNameB: "mosheyu"
// win: 1
//     [[Prototype]]: Object


//  象棋展示
function boardPageShow(data){
    console.log(data);
    let trHtml = $("#boardTable tbody tr")[0].innerHTML;
    $("#boardTable tbody")[0].innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        $("#boardTable tbody")[0].innerHTML += trHtml;
    }
    for (let j = 0; j < data.length; j++) {
        // creationTime: 1637073626
        // elapsed: 350

        // boardDetail: "sssssssssssssss?23,44,s,f|33,44,t,y|"
        let boardInit = "";
        if (data[j].boardDetail.split("?")[0].length > 0){
            // boardInit = data[j].boardDetail.split("?")[0];
            boardInit = "自定义对局";
        }else {
            boardInit = "初始棋局";
        }
        $("#boardTable tbody tr")[j].children[0].innerText = boardInit;
        //  用户A               userNameA: "admin"
        $("#boardTable tbody tr")[j].children[1].innerText = data[j].userNameA;
        //  用户B               userNameB: "mosheyu"
        $("#boardTable tbody tr")[j].children[2].innerText = data[j].userNameB;
        //  对局状态             win: 1
        $("#boardTable tbody tr")[j].children[3].innerText = winStatusToStr(data[j].win);
        // 创建时间              creationTime: 1637073626
        $("#boardTable tbody tr")[j].children[4].innerText = formatTimestamp(new Date(data[j].creationTime));
        //  耗时                elapsed: 350
        $("#boardTable tbody tr")[j].children[5].innerText = formatElapsed(data[j].elapsed);
        //  存储状态                status: 0
        $("#boardTable tbody tr")[j].children[6].innerText = statusToStr(data[j].status);

        // boardId: "33a1f10c5fa0a8020eae263fc07a4bde"
        $("#boardTable tbody tr")[j].children[7].children[0].dataset.id = data[j].boardId;
    }
}



//  帖子展示
function invitationPageShow(data){
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


//  评论展示
function discussPageShow(data){
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

//  用户展示
function userPageShow(data){
    console.log(data);
    let trHtml = $("#userTable tbody tr")[0].innerHTML;
    $("#userTable tbody")[0].innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        $("#userTable tbody")[0].innerHTML += trHtml;
    }
    for (let j = 0; j < data.length; j++) {
        //  用户名             userName: "mosheyu"
        $("#userTable tbody tr")[j].children[0].innerText = data[j].userName;
        //  性别              sex: 0
        $("#userTable tbody tr")[j].children[1].innerText = userSexToStr(data[j].sex);
        $("#userTable tbody tr")[j].children[1].dataset.sex = data[j].sex;
        //  年龄               age: 10
        $("#userTable tbody tr")[j].children[2].innerText = data[j].age;
        //  头像               photoUrl: "mosheyu.jpg"
        $("#userTable tbody tr")[j].children[3].children[0].src = "http://localhost:8080/CP/photos/"+data[j].photoUrl;
        //  简介                  introduction: "用户：mosheyu"
        $("#userTable tbody tr")[j].children[4].innerText = data[j].introduction;
        //  创建时间            joinDate: "1636256898203"
        $("#userTable tbody tr")[j].children[5].innerText = formatTimestamp( new  Date(Number.parseInt(data[j].joinDate)));
        //  用户类型            status: 0
        $("#userTable tbody tr")[j].children[6].innerText = userStatusToStr(data[j].userType);
        $("#userTable tbody tr")[j].children[6].dataset.userType = data[j].userType;
        //  状态               userType: 0
        $("#userTable tbody tr")[j].children[7].innerText = statusToStr(data[j].status);
        $("#userTable tbody tr")[j].children[7].dataset.status = data[j].status;

        $("#userTable tbody tr")[j].children[8].children[0].dataset.id = data[j].userName;
        $("#userTable tbody tr")[j].children[8].children[1].dataset.id = data[j].userName;
        // $("#userTable tbody tr")[j].children[8].children[2].dataset.id = data[j].userName;
    }

}


//  个人信息展示
function personalPageShow(data){
    $("#formUserName")[0].innerText = data.userName;
    $("#formUserPhoto")[0].src = "http://localhost:8080/CP/photos/"+ data.photoUrl;
    //设置性别文本
    $("#formUserSex")[0].innerText = userSexToStr(data.sex);
    //设置性别的data-value
    $("#formUserSex")[0].dataset.value = data.sex;
    $("#formUserAge")[0].innerText = data.age;
    $("#formUserIntro")[0].innerText = data.introduction;
}







function boardDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(0,thisEle.dataset.id);
}
function invitationDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(1,thisEle.dataset.id);
}
function discussDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(2,thisEle.dataset.id);
}
function userDelete(thisEle){
    //  发送ajax请求，删除
    deleteById(3,thisEle.dataset.id);
}



function deleteById(indDele,eleId){
    $.ajax({
        url: objectUrl + "/admin" + "/deleteById",
        type: "POST",
        async: true,
        data: JSON.stringify({type: indDele, id: eleId}),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            if (data.status) {
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
                hintModelShow("帖子修改成功","green");
                document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a")[1].click();
            }else {
                console.log("操作失败");
            }
        }
    });
}



function userUpdate(btnUpdateInvi){
    $("#updateUserName")[0].value = btnUpdateInvi.dataset.id;
    $('#updateUserpassword').modal('show');
}

function updateUser(){
    let userName = $("#updateUserName")[0].value;
    let userPassword = $("#inputUserPassword")[0].value;
    $.ajax({
        url: objectUrl + "/user" + "/updatePass",
        type: "POST",
        async: true,
        data: JSON.stringify({
            'userName': userName,
            'userPassword':userPassword

        }),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        // dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            console.log(data);
            if (data) {
                $('#updateUserpassword').modal('hide');
                document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a")[3].click();
                hintModelShow("密码修改成功","green");
            }else {
                console.log("操作失败");
            }
        }
    });
}


//#region 状态码转字符串



//   胜负手状态码转字符串
function winStatusToStr(winStatus){
    switch (winStatus){
        case 0:
            return "";
            // break;
        case 1:
            return "红方胜";
            // break;
        case 2:
            return "黑方胜";
            // break;
        case 3:
            //
            return "平局";
            // break;
        case 4:
            //
            return "黑方超时";
            // break;
        case 5:
            //
            return "60步判和";
            // break;
        default:
            return "对局未完成";
            // break;
    }

}
//   对局耗时转字符串
function formatElapsed(elapsedNum){
    let minute = Math.floor(elapsedNum/60);
    let second = elapsedNum%60;
    return minute+":" + second;
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


//#endregion











//工具函数  提示框   形参：提示信息   提示框颜色
function hintModelShow(hintMsg, borderColor) {
    //关闭所有模态框
    $('.modal').modal('hide');
    //修改提示信息
    $("#hintShowText")[0].innerText = hintMsg;
    //修改提示框颜色
    $("#hintShowDiv")[0].style.borderColor = borderColor;
    $("#hintShow").modal('show');
}

//提示模态框显示后两秒后自动关闭
$('#hintShow').on('show.bs.modal', function (e) {
    // console.log("准备关闭");
    setTimeout(function () {
        $('#hintShow').modal('hide');
    }, 1500);
})






//#region  冗余低效代码

//创建文件碎片节点
// let trListEle = document.createDocumentFragment();
// for (let i = 0; i < data.length; i++) {
//     let trEle = document.createElement("tr");
//     let tdEleFotTitle = document.createElement("td");
//     tdEleFotTitle.innerText = data[i].invitationTitle;
//     let tdEleFotBody = document.createElement("td");
//     tdEleFotBody.innerText = data[i].invitationBody;
//     let tdEleFotTime = document.createElement("td");
//     tdEleFotTime.innerText = formatTimestamp(new Date(data[i].creationTime));
//     let tdEleFotstatus = document.createElement("td");
//     tdEleFotstatus.innerText = statusToStr(data[i].status);
//     let tdEleFotBtn = document.createElement("td");
//     let btnUpdate = document.createElement("button");
//     btnUpdate.className = "btn btn-warning ";
//     btnUpdate.dataset.toggle="modal";
//     btnUpdate.dataset.target="#updateInvi";
//     btnUpdate.innerText = "修改";
//     let btnDelete = document.createElement("button");
//     btnDelete.className = "btn btn-danger";
//     btnDelete.innerText = "删除";
//     tdEleFotBtn.appendChild(btnUpdate);
//     tdEleFotBtn.appendChild(btnDelete);
//
//
//     trEle.appendChild(tdEleFotTitle);
//     trEle.appendChild(tdEleFotBody);
//     trEle.appendChild(tdEleFotTime);
//     trEle.appendChild(tdEleFotstatus);
//     trEle.appendChild(tdEleFotBtn);
//
//     trListEle.appendChild(trEle);
// }
// $("#inviTable tbody")[0].appendChild(trListEle);
//
//
//
//
// console.log(data);
//#endregion