console.log("导入game.js文件");

let boardBox = document.querySelector("#boardBox");

//#region   初始化棋局布局
//创建文件碎片节点
let pieceDivs = document.createDocumentFragment();
for (let i = 0; i < 90; i++) {
    let piece = document.createElement("div");
    piece.classList.add("pieces");
    //添加单击事件
    piece.onclick = pieceOnClick;
    pieceDivs.appendChild(piece);
}
boardBox.appendChild(pieceDivs);
//执行函数，初始化棋局
updateBoardHtml.updateBoard(boardInit);

//#endregion

//对局条件选择 或 展示   形参分别是，是否交战，是否登录

// btnModalShow(true,true);
btnModalShow(false,false);
//根据是否登录，禁用或启用按钮
// btnDIsSta(isLogin());  // -------------------后期启用




//单个棋子的单击事件
function pieceOnClick(){
    console.log("userTakeStatus:"+userTakeStatus);
    console.log("userIsRed:"+userIsRed);
    if (userTakeStatus != userIsRed){
        gameHint.greyHintShow("等待对方中");
        return;
    }
    let indPie = $(".pieces").index(this);
    if (fromPiece == null){
        //第一次点击
        if(chessWithUser(indPie,userIsRed)){
            // 是本阵营的棋子      //存储起点棋子
            fromPiece = indPie;
            //将起始棋子样式变化
            // ---
        }else {
            return;
        }
    }else {
        //第二次点击
        if (!chessWithUser(indPie,userIsRed)){
            //是空地或对方棋子   避免自己吃自己        //存储终点棋子
            toPiece = indPie;
            //判断走步有效性
            if (walkCheck()){
                //走步有效      //开始走步
                userTakeStatus = !userTakeStatus;
                executeWalk();
                console.log(boardInit.join("")+"?"+ pieceStep[pieceStep.length-1].join(","));
                //发送棋局
                sendBoard(13,boardInit.join("")+"?"+ pieceStep[pieceStep.length-1].join(","));
            }
            else {
                //走步无效      //-------给与提示信息
                gameHint.greyHintShow("无效走步");
            }
        }else {
            // 自己吃自己？ 违规走步。
            gameHint.greyHintShow("无效走步");
        }
        // 请空起点
        fromPiece = null;
    }
}




//  悔棋按钮的单击事件
function takeBack(){

    console.log("userTakeStatus:"+userTakeStatus);
    console.log("userIsRed:"+userIsRed);
    if (unDoNum < 0) {
        gameHint.blackHintShow("悔棋过多");
        return;
    } else {
        unDoNum = unDoNum - 1;
        //  定时器开始   标明该自己走棋
        upHOfTimeMes.switchTimeManage(userIsRed);
    }
    // 判断该谁走棋，以此判断悔棋该走几步。
    let num = 1;
    if (userTakeStatus == userIsRed) {
        //  读取最后一步，更改棋局
        boardInit =  ruleCheck.retreat(pieceStep.pop(), boardInit);
        setTimeout(updateBoard(boardInit),500);
        num += 1;
    }
    boardInit =  ruleCheck.retreat(pieceStep.pop(), boardInit);
    setTimeout(updateBoardHtml.updateBoard(boardInit),500);


    //  定时器开始   标明该自己走棋
    upHOfTimeMes.switchTimeManage(userIsRed);

    // 发送棋局
    let msg = {
        "msgType": 17,
        "sender": userName,
        "receiver": warUserName,
        "msgString": boardInit.join(""),
        "msgAddition":num,
    };
    //发送给后端
    webSocket.send(JSON.stringify(msg));
}
//  认输按钮的点击事件
function giveUpClick(){
    // 发送棋局
    sendBoard(21,boardInit.join(""));

    // 对战提示信息展示
    btnModalShow(false,true);
    //  重置定时器
    upHOfTimeMes.resetTime(600);

    gameHint.redHintShow("败");

    $(".userUseBtn")[0].style.display = "none";
    $("#refuseBtnGroup")[0].style.display = "block";
    waleNum = pieceStep.length;
}

//   发送求和信息
function getPeace(){
    // 发送棋局
    sendBoard(18,boardInit.join(""));

}
//  拒绝求和
function  refusePeace(){
    // 发送棋局
    sendBoard(19,boardInit.join(""));
}
//  同意求和
function agreePeace(){
    // 发送棋局
    sendBoard(20,boardInit.join(""));
    //  同意求和
    hintModelShow("同意和棋","palegreen");

    // 对战提示信息展示
    btnModalShow(false,true);
    gameHint.greenHintShow("和棋");
    //  重置定时器
    upHOfTimeMes.resetTime(600);
    $(".userUseBtn")[0].style.display = "none";
    $("#refuseBtnGroup")[0].style.display = "block";
    waleNum = pieceStep.length;
}


function beforeWalk() {
    console.log("上一步" + waleNum);
    if ((waleNum - 1) < 0) {
        gameHint.orangeHintShow("第一步了");
        return;
    }
    waleNum = waleNum - 1;
    console.log("上一步" + pieceStep[waleNum]);
    boardInit = ruleCheck.retreat(pieceStep[waleNum], boardInit);
    setTimeout(updateBoardHtml.updateBoard(boardInit), 500);

}

function lastWalk() {
    if ((waleNum + 1) >= pieceStep.length) {
        gameHint.greyHintShow("最后一步了");
        return;
    }
    waleNum = waleNum + 1;
    let oneOperation = pieceStep[waleNum];
    console.log("下一步" + waleNum);
    console.log("下一步" + oneOperation);
    boardInit = ruleCheck.updateBoardString(oneOperation,boardInit);
    setTimeout(updateBoardHtml.updateBoard(boardInit), 500);
}

function newBoard() {
    boardInit =  [
        "rnbakabnr",
        "000000000",
        "0c00000c0",
        "p0p0p0p0p",
        "000000000",
        "000000000",
        "P0P0P0P0P",
        "0C00000C0",
        "000000000",
        "RNBAKABNR"
    ];
    setTimeout(updateBoardHtml.updateBoard(boardInit), 500);

    $("#refuseBtnGroup")[0].style.display = "none";

    //  获取用户列表，请求发送用户列表
}


function btnInputBoardOnClick(){
    this.classList.add("active");
}

//  导入棋局模态框页面中的   确认按钮
$("#btnInputBoardSure")[0].onclick = function () {
    boardInit = ruleCheck.oneToTwo($("#strInputBoard")[0].value);
    setTimeout(updateBoardHtml.updateBoard(boardInit), 500);
}

// 导出棋局     暂时展示在控制台
$("#btnOutputBoard")[0].onclick = function outputBoard() {
    let boardStep = pieceStep.join("|");
    console.log(boardStep);
    for (let i = 0; i < boardStep.length; i++) {
        console.log(boardStep.split("|")[i].split(","));
    }
}

//  模态框启动前刷新模态框状态。
$('#modalShow').on('show.bs.modal', function (e) {
    //如果是等待状态，就刷新初始状态
    if ($("#titleStartWar")[0].innerHTML == "等待回复") {
        $("#titleStartWar")[0].innerHTML = "开始对战";
        $(".startWarOne")[0].style.display = "block";
        $(".startWarTwo")[0].style.display = "none";
        $(".btnStartWarModel")[0].style.display = "block";
        $(".btnStartWarModel")[1].style.display = "none";

    }
    //判断是否选择了用户
    let startWarUserName = $("#btnUserDownMenu")[0].innerText;
    if (startWarUserName == "用户对战") {
        $("#startWarUserName")[0].innerText = "暂未选定";
        $("#startWarStatus")[0].innerText = "暂未选定";
        //禁用约战按钮
        if (!$("#btnStartWar")[0].classList.contains("disabled")) {
            $("#btnStartWar")[0].classList.add("disabled");
            $("#btnStartWar")[0].onclick = function (){};
        }
    } else {
        //启用约战按钮
        $("#startWarUserName")[0].innerText = startWarUserName;
        let radioNum = $("#radioBtnGroup input:checked")[0].value;
        radioNum = Number.parseInt(radioNum);
        $("#startWarStatus")[0].innerText = getStrBoardType(radioNum);
        $("#startWarStatus")[0].dataset.boardType = radioNum;
        if ($("#btnStartWar")[0].classList.contains("disabled")) {
            $("#btnStartWar")[0].classList.remove("disabled");
            $("#btnStartWar")[0].onclick = btnStartWarOnClick;
        }
    }
})


//收到用户列表，改变下拉框在线人数和状态   并给每个选项添加单击事件
function userDownMenuUpdate(userNameList){
    //只有本人，无人在线
    btnModalShow(false,true);
    //如果在线用户大于1，就渲染   1代表自己，2代表还有一个人
    if (userNameList.length > 1) {
        //改变下拉框状态
        $("#btnUserDownMenu")[0].innerText = "用户对战";
        let btnSpan = document.createElement("span");
        btnSpan.classList.add("caret");
        $("#btnUserDownMenu")[0].appendChild(btnSpan);

        //改变下拉框选项
        for(let i= 0;i<userNameList.length; i++){
            //不添加本人的选项卡
            if (userNameList[i] != userName){
                let liEle = document.createElement("li");
                let aEle = document.createElement("a");
                aEle.innerText = userNameList[i];
                liEle.appendChild(aEle);
                $("#userDownMenu")[0].appendChild(liEle);
            }
        }

        // 启用用户列表按钮
        $("#btnUserDownMenu")[0].classList.remove("disabled");

        //下拉框选项添加单击事件
        downLiAddOnClick();
        // 渲染结束
    }
}

//给所有的下拉列表添加单击事件
function downLiAddOnClick() {
    for (let i = 0; i < $("#userDownMenu li").length; i++) {
        $("#userDownMenu li")[i].onclick = function () {
            if (this.classList.contains("disabled")) {
                return;
            }
            $("#btnUserDownMenu")[0].innerText = this.children[0].innerText;
            $("#btnUserDownMenu")[0].classList.add("active");
            let btnSpan = document.createElement("span");
            btnSpan.classList.add("caret");
            $("#btnUserDownMenu")[0].appendChild(btnSpan);
            // console.log( $("#btnUserDownMenu")[0].innerText);
            $("#btnBegin")[0].classList.remove("disabled");
        }
    }
}




//#region  单选按钮的取值和选择

// 获取目前单选按钮的选择
function getRadioBoardType(){
    // console.log($("#radioBtnGroup input:checked")[0].value);
    // let radioIndex = radioGroup.index($("#radioBtnGroup input[checked='checked']")[0]);
    return $("#radioBtnGroup input:checked")[0].value;
}
// 设置目前单选按钮的选择
function setRadioBoardType(boardTypeNumb) {
    $("#radioBtnGroup input")[boardTypeNumb].checked = "checked";
}
// 根据索引，获取对应的对战类型
function getStrBoardType(boardTypeNumb) {
    switch (boardTypeNumb) {
        case 0:
        // case "0":
            return "正常对战";
        case 1:
        // case "1":
            return "指导棋";
        case 2:
        // case "2":
            return "棋局研究";
        default:
            return "系统错误";
    }
}
// 根据类型字符串，获取对应的对战类型索引
function getIndBoardType(boardTypeStr) {
    switch (boardTypeStr) {
        case "正常对战":
            return 0;
        case "指导棋":
            return 1;
        case "棋局研究":
            return 2;
        default:
            return 3;
    }
}
//#endregion



//#region   索引处阵营对比

//判断棋子与用户是否是同一阵营
function chessWithUser(piecesInd, userColorStatus) {
    let userEle = "";
    if (userColorStatus) {
        userEle = "R"
    } else {
        userEle = "B";
    }
    if ($(".pieces")[piecesInd].dataset.camp == userEle) {
        return true;
    } else {
        return false;
    }
}

//判断棋子与棋子是否是同一阵营   根据索引
function chessWithChessByInd(fromChess, toChess) {
    if ($(".pieces")[fromChess].dataset.camp == $(".pieces")[toChess].dataset.camp) {
        return true;
    } else {
        return false;
    }
}


//根据索引，判断该位置是否为空
function isNullPiece(indPie) {
    if ($(".pieces")[indPie].dataset.camp == "a") {
        return true;
    } else {
        return false;
    }
}

//#endregion

//#region   根据是否开战 是否登录 改变页面显示与布局
function btnModalShow(selectStatus,isLoginUser){
    if (!isLoginUser){
        //  用户列表 和导入棋局    棋局对战选项
        $(".boardSelectStatus")[0].style.display = "none";
        //  对战信息
        $(".boardSelectStatus")[1].style.display = "none";
        //  请先登录提示
        $(".boardSelectStatus")[2].style.display = "block";
        //   悔棋按钮隐藏
        $(".userUseBtn")[0].style.display = "none";
        return ;
    }
    //   是否开战
    if (selectStatus) {
        //  用户列表 和导入棋局    棋局对战选项
        $(".boardSelectStatus")[0].style.display = "none";
        //  对战信息
        $(".boardSelectStatus")[1].style.display = "block";
        //  请先登录提示
        $(".boardSelectStatus")[2].style.display = "none";
        //   悔棋按钮显示
        $(".userUseBtn")[0].style.display = "block";

        //交战双方用户名提示
        if (userIsRed) {
            $(".boardSelectStatus .row span")[1].innerText = userName;
            $(".boardSelectStatus .row span")[3].innerText = warUserName;
        } else {
            $(".boardSelectStatus .row span")[1].innerText = warUserName;
            $(".boardSelectStatus .row span")[3].innerText = userName;
        }
        //  对战类型展示
        $(".boardSelectStatus .row span")[5].innerText = getStrBoardType(boardType);

    } else {
        //  用户列表 和导入棋局    棋局对战选项
        $(".boardSelectStatus")[0].style.display = "block";
        //  对战信息
        $(".boardSelectStatus")[1].style.display = "none";
        //  请先登录提示
        $(".boardSelectStatus")[2].style.display = "none";
        //   悔棋按钮隐藏
        $(".userUseBtn")[0].style.display = "none";
        // if ($("#btnUserDownMenu").innerText == "暂未人员在线"){
        //     // 开始对战禁用   后期初始化用户列表后会启用。
        $("#btnUserDownMenu")[0].innerText = "暂无人员在线";
        $("#btnUserDownMenu")[0].classList.add("disabled");
        //  没有开战，开战条件选择
        setRadioBoardType(0);
        $("#btnBegin")[0].classList.add("disabled");
        // }
    }

}

//#endregion





//#region   约战的处理

//单击约战按钮，修改模态框标题，隐藏输入框，显示加载图片。向对方发送请求约战信号。等待对方回复，
//回复确定就关闭模态框，开始计时。回复失败就关闭模态框，提示约战失败。

//约战按钮点击事件
function btnStartWarOnClick(){
    $("#titleStartWar")[0].innerHTML = "等待回复";
    $(".startWarOne")[0].style.display = "none";
    $(".startWarTwo")[0].style.display = "block";
    $(".btnStartWarModel")[0].style.display = "none";
    $(".btnStartWarModel")[1].style.display = "block";
  //向对方发送约战信息


    //获取对方的用户名
    warUserName = $("#startWarUserName")[0].innerText;
    receiver = warUserName;
    let msg = {
        "msgType":10,
        "sender":userName,
        "receiver":receiver,
        "msgString":$("#startWarStatus")[0].dataset.boardType,
        "msgAddition":boardInit.join(""),
    };

    //发送给后端
    webSocket.send(JSON.stringify(msg));
}


//  处理用户发来的约战信息
function startWarShow(msg) {
    let message = {
        "msgType": 0,
        "sender": userName,
        "receiver": msg.sender,
        "msgString": ""
    };

    if (warUserName != null && warUserName != undefined) {
        //正在约战或对战，自动拒绝
        message.msgType = 11;
        webSocket.send(JSON.stringify(message));
    } else {
        //关闭所有模态框
        $('.modal').map(function () {
            $(this).modal('hide');
        });
        //弹出选择模态框，供用户选择
        $("#startWarSelect").modal('show');
        //取消模态框的默认关闭事件   单击模态框外部或按“ESC,都无法关闭模态框
        $('#startWarSelect').modal({backdrop: 'static', keyboard: false});

        // $("#startWarStatus")[0].dataset.boardType
        boardType = Number.parseInt(msg.msgString)
        $("#startWarType")[0].innerText = getStrBoardType(boardType);
        //显示用户名
        $("#startWarSender")[0].innerText = msg.sender;
        //点击  拒绝
        $("#btnRefuseStartWar")[0].onclick = function () {
            message.msgType = 11;
            webSocket.send(JSON.stringify(message));
        }
        //点击  接受
        $("#btnAgreeStartWar")[0].onclick = function () {
            message.msgType = 12;
            warUserName = msg.sender;
            webSocket.send(JSON.stringify(message));

            //红方开始走起
            userTakeStatus = true;
            //标明自己不是红方，是黑方。
            userIsRed = false;
            //展示对战信息
            //展示对战信息
            btnModalShow(true,true);
            // 定时器启动  红方开始计时
            upHOfTimeMes.switchTimeManage(true);


            document.querySelectorAll("nav ul:first-child.nav.navbar-nav li a")[1].click();
        }
    }

}

//用户接受约战  开始战斗
function beginWar() {
    //提示开始战斗
    hintModelShow("用户接受对战", "palegreen");


    // 对战信息展示  用户开始对战
    btnModalShow(true,true);
    //  定时器开始   标明该红方走棋
    upHOfTimeMes.switchTimeManage(true);
}


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

//#endregion




