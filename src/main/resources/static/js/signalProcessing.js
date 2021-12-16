//      根据消息序号转向对应的处理方法
function signalSwitchOperation(msgType,msg){
    switch (msgType){
        case 1:
            console.log("刷新在线："+msg.msgString);
            let userNameList = stringToArray(msg.msgString);
            console.log("接收到用户列表"+ userNameList);
            userListHtmlUpdate(userNameList);
            userDownMenuUpdate(userNameList);
            break;
        case 2:
            console.log("广播信息："+msg.msgString);
            msgToAllShow(msg);
            break;
        case 3:
            console.log("用户私聊："+msg.msgString);
            msgToOneShow(msg);
            break;
        case 4:
            break;
        case 10:
            //用户发来约战
            startWarShow(msg);
            break;
        case 11:
            //用户拒绝约战
            warUserName = null;
            hintModelShow("用户拒绝对战","red");
            break;
        case 12:
            //用户接受了约战

            //  发起的一方是红方
            userIsRed = true;
            warUserName = msg.sender;
            //展示对战信息
            btnModalShow(true,true);

            beginWar();
            break;
        case 13:
            //传递棋局
            boardInit = oneToTwo(msg.msgString.split("?")[0]);

            console.log(msg.msgString.split("?")[1].split(","));
            console.log(msg.msgString.split("?")[0]);

            // [23,24,"BR","BK"];
            let pieceStepNew = msg.msgString.split("?")[1].split(",");
            pieceStepNew[0] = Number.parseInt(pieceStepNew[0]);
            pieceStepNew[1] = Number.parseInt(pieceStepNew[1]);

            pieceStep.push(pieceStepNew);
            //改变该谁下棋
            //改变定时器
            redUserOperation();

            updateBoardHtml.updateBoard(boardInit);
            break;

        case 17:
            //  悔棋
            boardInit = oneToTwo(msg.msgString);
            //  定时器开始   标明该对方走棋
            redUserOperation(!userIsRed);
            // 棋局
            updateBoard(boardInit);
            //  提示对方悔棋
            gameHint.blackHintShow("对方悔棋");
            // hintModelShow("对方悔棋","palegreen");


            break;
        case 18:
            //  求和申请

            //显示模态框
            $("#getPeaceModel").modal('show');
            break;
        case 19:
            //  求和被拒
            gameHint.orangeHintShow("拒绝和棋");
            break;
        case 20:
            //  同意求和
            hintModelShow("同意和棋","palegreen");

            // 对战提示信息展示
            btnModalShow(false,true);
            gameHint.orangeHintShow("和棋");
            //  重置定时器
            resetTime();


            $(".userUseBtn")[0].style.display = "none";
            $("#refuseBtnGroup")[0].style.display = "block";
            waleNum = pieceStep.length;
            break;
        case 21:
            //  认输



            // 对战提示信息展示
            btnModalShow(false,true);

            gameHint.greenHintShow("胜");
            //  重置定时器
            resetTime();


            $(".userUseBtn")[0].style.display = "none";
            $("#refuseBtnGroup")[0].style.display = "block";
            waleNum = pieceStep.length;


            // boardPlayEnd(msg);
            break;
        case 22:
            //  超时认输

            break;
        case 23:

            break;
    }

}
