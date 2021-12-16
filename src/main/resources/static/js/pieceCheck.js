
//交战方名称
let warUserName;

//起始点的棋子
let fromPiece = null;
let toPiece = null;

//  官方开局
let BOARDSTRING = ["rnbakabnr", "000000000", "0c00000c0", "p0p0p0p0p", "000000000",
    "000000000", "P0P0P0P0P", "0C00000C0", "000000000", "RNBAKABNR"];

//存储步数
let pieceStep =[];

// 本用户是不是红方？  阵营表示   真表示红方  假表示黑方
let userIsRed = true;
// 下棋状态         回合表示    真表示红方回合，假表示黑方的回合。
let userTakeStatus = true;

//被将死判断棋局结束
let boardEnd = false;
//棋局初始数组
let boardInit = BOARDSTRING;

//  回合数
let waleNum = 0;
//棋局类型
let boardType = 0;
// 悔棋次数
let unDoNum = 3;
//      规则检查函数
let  ruleCheck = {
    boardString:"",

    //  帅的范围
    KScope: [3, 4, 5, 12, 13, 14, 21, 22, 23],
    //  将的范围
    kScope: [66, 67, 68, 75, 76, 77, 84, 85, 86],
    //  士的范围  -- 红方
    AScope: [3, 5, 13, 21, 23],
    //  士的范围  -- 黑方
    aScope: [66, 68, 76, 84, 86],
    //  相的范围
    BScope: [2, 6, 18, 22, 26, 38, 42],
    //  象的范围
    bScope: [47, 51, 63, 67, 71, 83, 87],

    //  数据示例  我可太想要双屏了。
    // let oneOperation =[23,24,"R","k"];
    // oneOperation = [fromInd,toInd,fromPieces,toPieces];


    //  计算x、y位置，以数组形式返回，第一个为x，第二个为y
    getPosition(pieInd){
        return [(pieInd%9),(parseInt(pieInd/9))];
    },
    //  计算一维数组位置，直接返回索引值
    getIndForXAndY(x,y){
        return x+y*9;
    },
    //  一维数组转为二维数组      // oneToTwo(boardInit.join(""));
    oneToTwo(boardString) {
        let boartList = [];
        function doOneToTwo(bStr) {
            if (!bStr) return;
            boartList.push(bStr.substr(0, 9));
            bStr = bStr.substr(9);
            doOneToTwo(bStr);
        }
        doOneToTwo(boardString);
        return boartList;
    },

    //#region       修改棋局字符串，   主要方法：走步方法、悔棋方法
    //      走步操作
    goForward(oneOperation,boardString = this.boardString){
        let oneOpera = [oneOperation[0],oneOperation[1],'0',oneOperation[3]];
        return this.updateBoardString(oneOpera,boardString);
    },
    //      悔棋操作
    retreat(oneOperation,boardString){
        return this.updateBoardString(oneOperation,boardString);
    },
    //      修改棋局，返回修改后的棋局
    updateBoardString(oneOperation,boardString){
        //  起点替换
        boardString = this.charToReplace(oneOperation[0],oneOperation[2],boardString);
        // 目标点替换
        boardString = this.charToReplace(oneOperation[1],oneOperation[3],boardString);
        return boardString;
    },
    //  将对应索引的字符替换   形参：索引，字符，棋局数组
    charToReplace(pieInd,pieName,boardString){
        let x = this.getPosition(pieInd)[0];
        let y = this.getPosition(pieInd)[1];
        // 字符串转为数组
        let s = boardString[y].split("");
        //替换字符
        s[x] = pieName;
        // 数组转为字符串
        boardString[y]=s.join("");
        return boardString;
    },

    //#endregion




    //#region   是否被将军  主要方法：模拟走步是否被将军？是否被将军？将帅照面？

    //  模拟走步，  判定一方是否被将军  返回真，表示被将军
    simulateWalk(fromInd,toInd,piecesChar,userColor,boardString = this.boardString){
      this.boardString = boardString;
      //        模拟走步
      this.boardString = this.goForward(fromInd,toInd,piecesChar,boardString);
      return this.isCheck(userColor);
    },

    //      判断某方是否被将军  真表示被将军
    isCheck(userColor,boardString = this.boardString){
        //  首先排除照面情况
        if (this.isKMeetk(boardString)){
            return true;
        }
        //  棋子索引        二维数组
        let premisesList = [];
        //  攻击点         存储所有的攻击点，
        let pointOfAttack = [];
        //  被将军的将、帅
        let kingPiece = "";

        //  棋子类型
        let piecesCharList = [];
        //  根据阵营，初始化字符数组
        if (userColor) {
            piecesCharList = ["n","r","c","p"];
            kingPiece = "K";
        } else {
            piecesCharList = ["N","R","C","P"];
            kingPiece = "k";
        }

        //  获取各个种类棋子的索引数组
        for (let i = 0; i < piecesCharList.length; i++) {
            premisesList[i] = this.charIndexInString(piecesCharList[i], boardString);
            premisesList[i].forEach(function (x){
                //      将每个棋子的可达范围加入到攻击点数组中。
               pointOfAttack.push(this.getMobileSpaceByType(piecesCharList[i],x));
            });
        }
        //  打平数组，判断老将的位置是否在其中
        let kingInd = this.charIndexInString(kingPiece,boardString)[0];
        pointOfAttack = pointOfAttack.flat();

        if (kingPiece in pointOfAttack)return true;
        else return false;
    },

    //  检查将、帅是否进照面      真表示之间为空 照面。        假表示之间不为空，不照面。
    isKMeetk(boardString = this.boardString) {
        this.boardString = boardString;
        //      获取将、帅的索引
        let BKIndexPiece = this.charIndexInString("K",boardString)[0];
        let SkIndexPiece = this.charIndexInString("k",boardString)[0];
        //      获取它们的列
        let xOfBK =  BKIndexPiece % 9;   //      红方的帅   在上方
        let xOfSk = SkIndexPiece % 9;    //      黑方的将   在下方

        //  是否为空？
        let isNull = true;

        if (xOfBK == xOfSk){
            //  是否在同一列？
            // 获取之间的棋子索引，并判断是否为空。  一个不为空，即代表不照面
            for (let i = BKIndexPiece+9;i<SkIndexPiece;i+=9){
                if (!this.isNullInBoard(i)){
                    isNull = false;
                    break;
                }
            }
        }else {
            isNull = false;
        }
        return isNull;
    },

    //#endregion


    //#region       获取棋子移动范围

    //  根据棋子类型，去对应的方法中获取可动范围，并返回。
    getMobileSpaceByType(piecesType,fromInd,boardString = this.boardString){
        let piecesName = "";
        if (typeof piecesType === "string"){
            piecesName = piecesType. toLowerCase();
        }
        console.log(`geiMobileSpaceOf${piecesName} 方法开始执行。----${piecesName}`);
        return this["geiMobileSpaceOf"+piecesName](fromInd,boardStr);
    },

    //  获取炮的移动和攻击范围
    geiMobileSpaceOfC(fromInd, boardStr) {
        ruleCheck.boardString = boardStr;
        let x = [];

        //      获取左边的横向和纵向。
        let a = Math.floor(fromInd / 9);    //  0-9行
        let b = fromInd % 9;        //  0-8列

        let c = [], r = [];
        for (let i = 0; i < 10; i++) {
            c.push(i * 9 + b);    //  存储一列
        }

        for (let i = 0; i < 10; i++) {
            r.push(a * 9 + i);    //  存储一行
        }
        //  找出起点在数组中的索引
        a = c.indexOf(fromInd);     //  列
        b = r.indexOf(fromInd);     //  行

        let scopeDetection = [[], [], [], []];
        //  排除靠边的情况，    并且反转部分数组，保证索引靠前的元素离起点近
        if (a != 0) {
            //      不靠顶边
            scopeDetection[0] = c.splice(0, a).reverse();
        }
        if (a != (c.length - 1)) {
            //      不靠底边
            scopeDetection[1] = c.splice(a + 1, c.length);
        }
        if (b != 0) {
            //      不靠左边
            scopeDetection[2] = r.splice(0, b).reverse();
        }
        if (b != (r.length - 1)) {
            //      不靠右边
            scopeDetection[3] = r.splice(b + 1, r.length);
        }
        //  遍历四个方向上的空位，然后跳过一格，获取四个可能的攻击位。
        for (let sDet in scopeDetection) {
            //  遍历各个方向
            for (let i = 0; i < sDet.length; i++) {
                if (this.isNullInBoard(sDet[i])) {
                    //  如果是空，代表可以走
                    x.push(sDet[i]);
                } else {
                    //  如果不是空，从下一个开始遍历
                    let j = i + 1;
                    while (j < sDet.length) {
                        if (this.isNullInBoard(toInd)) {
                            //  如果是空，继续下一个。
                            j++;
                            continue;
                        }
                        if (!this.isSameColor(fromInd, sDet[j])) {
                            //      如果不是空，则不能是同一阵营
                            x.push(sDet[j]);
                        }
                        break;
                        //     添加最后一个，可能是攻击点的地方。
                    }
                    break;
                    // 结束循环
                }
            }
        }
        return x;
    },

    //   车获取横向的可动范围
    getRowMobileSpace(fromInd, boardStr, isAttack) {
        ruleCheck.boardString = boardStr;
        let x = [];
        let i = fromInd - 1;
        //      向左获取可动范围
        if (fromInd % 9 != 0) {
            //      排除棋子靠左边边线
            while (i % 9 != 8) {
                //      如果i取9的余数为8，代表换行了，结束执行。
                if (ruleCheck.isNullInBoard(i)) {
                    x.push(i);
                    i--;
                } else {
                    i--;
                    if ((i % 9 != 8) && isAttack(fromInd, i)) {
                        //      没有换行，而且该位置是对方的棋子，也是可以走的。
                        x.push(i);
                    }
                    break;
                }
            }
        }

        i = fromInd + 1;
        //      向右获取可动范围
        if (fromInd % 9 != 8) {
            while (i % 9 != 0) {
                if (ruleCheck.isNullInBoard(i)) {
                    x.push(i);
                    i++;
                } else {
                    i = i + 1;
                    if ((i % 9 != 0) && isAttack(fromInd, i)) {
                        x.push(i);
                    }
                    break;
                }
            }
        }
        return x;
    },

    //   车获取纵向的可动范围
    getColMobileSpace(fromInd, boardStr) {
        ruleCheck.boardString = boardStr;
        let x = [];
        let i = fromInd - 9;
        //      向上获取可动范围
        if (fromInd / 9 >= 1) {
            //      确保棋子不靠边
            while (i >= 0) {
                //  确保目标位置在棋盘内
                if (ruleCheck.isNullInBoard(i)) {
                    x.push(i);
                    i -= 9;
                } else {
                    i -= 9;
                    if ((i >= 0) && (!ruleCheck.isSameColor(fromInd, i))) {
                        x.push(i);
                    }
                    break;
                }
            }
        }
        i = fromInd + 9;
        //      向下获取可动范围
        if (fromInd / 9 <= 9) {
            while (i < 90) {
                if (ruleCheck.isNullInBoard(i)) {
                    x.push(i);
                    i += 9;
                } else {
                    i += 9;
                    if ((i < 90) && (!ruleCheck.isSameColor(fromInd, i))) {
                        x.push(i);
                    }
                    break;
                }
            }
        }
        return x;
    },

    //  获取车的移动范围
    geiMobileSpaceOfR(fromInd, boardStr) {
        let x = [];

        function isAttack(fromInd, toInd) {
            //          阵营不同，可以攻击，即，可以走。
            if (!this.isSameColor(fromInd, toInd)) return true;
            else return false;

        }

        x.push(getRowMobileSpace(fromInd, boardStr, isAttack));
        x.push(getColMobileSpace(fromInd, boardStr, isAttack));
        return x;
    },

    //  获取马的移动范围
    geiMobileSpaceOfN(fromInd, boardStr) {
        let x = [-19, -17, -11, -7, 7, 11, 17, 19];
        let y = [];
        this.boardString = boardStr;
        x.forEach(function (x) {
            let temX = fromInd + x;
            //  1. 无越界
            if (temX >= 0 && temX <= 90) {
                //  2. 目标位置为空或不为自己这方。
                if (!this.isRedInBoard(temX)) {
                    // 3. 不别腿
                    if (!this.NClipCheck(fromInd, temX)) {
                        y.push(temX);
                    }
                }
            }
        })
        return y;
    },

    //  获取相、象的移动范围
    geiMobileSpaceOfB(fromInd, boardStr) {
        let x = [fromInd - 20, fromInd - 16, fromInd + 16, fromInd + 20];
        let y = [];
        let BScope = [];
        if (this.isRedInBoard(fromInd, boardStr)) BScope = this.BScope;
        else BScope = this.bScope;
        x.forEach(function (x) {
            //     这个值在范围内
            if (x in BScope) {
                //      起点终点不是同一阵营的
                if (!this.isSameColor(fromInd, x)) {
                    //      这个位置没有被别腿
                    if (this.BClipCheck(fromInd, x, boardStr)) {
                        y.push(x);
                    }
                }
            }
        });
        return y;
    },

    //  获取士的移动范围
    geiMobileSpaceOfA(fromInd, boardStr) {
        let x = [fromInd - 10, fromInd - 8, fromInd + 8, fromInd + 8];
        let y = [];
        let BScope = [];
        if (this.isRedInBoard(fromInd, boardStr)) BScope = this.AScope;
        else BScope = this.aScope;
        x.forEach(function (x) {
            //     这个值在范围内
            if (x in BScope) {
                //      起点终点不是同一阵营的
                if (!this.isSameColor(fromInd, x)) {
                    y.push(x);
                }
            }
        });
        return y;
    },

    //  获取帅、将的移动范围
    geiMobileSpaceOfK(fromInd, boardStr) {
        let x = [fromInd - 9, fromInd - 1, fromInd + 1, fromInd + 9];
        let y = [];
        let BScope = [];
        if (this.isRedInBoard(fromInd, boardStr)) BScope = this.KScope;
        else BScope = this.kScope;
        x.forEach(function (x) {
            //     这个值在范围内
            if (x in BScope) {
                //      起点终点不是同一阵营的
                if (!this.isSameColor(fromInd, x)) {
                    y.push(x);
                }
            }
        });
        return y;
    },

    //  获取兵、卒的移动范围
    geiMobileSpaceOfP(fromInd, boardStr) {
        let x = [];
        //  左右移动不会越界  目标位置可达。
        if (fromInd%9 != 0){
            if (!this.isSameColor(fromInd,fromInd-1,boardStr)){
                x.push(fromInd-1);
            }
        }
        if (fromInd%9 != 8){
            if (!this.isSameColor(fromInd,fromInd+1,boardStr)){
                x.push(fromInd-1);
            }
        }
        //     根据阵营，确定前进方向，且前进方向没有越界，目标位置可达。
        if (this.isRedInBoard(fromInd)){
            if (fromInd/9 <= 8){
                if (!this.isSameColor(fromInd,fromInd+9,boardStr)){
                    x.push(fromInd+9);
                }
            }
        }else {
            if (fromInd/9 >= 1){
                if (!this.isSameColor(fromInd,fromInd-9,boardStr)){
                    x.push(fromInd-9);
                }
            }
        }
        return x;
    },

    //#endregion


    //    返回棋子在棋局中的索引数组
    charIndexInString(piecesChar, boardString) {
        let position = 0;
        let piecesInd = -1;
        let pieceIndexList = [];
        while (position != -1) {
            position = boardString.indexOf(piecesChar, piecesInd + 1);
            if (position != -1) {
                pieceIndexList.push(position);
            }
            piecesInd = position;
        }
        return pieceIndexList;
    },


    // 判断是不是横向
    // 返回值：真表示是横向   假表示不在一行，是竖向的，但是有可能是歪的。
    isHorizontal(fromIndex, toIndex) {
        // 判断是不是横，即 除9得到的商相同。  商向下取整为整数
        if (Math.floor(fromIndex / 9) === Math.floor(toIndex / 9)) {
            return true;
        }
        return false;
    },

    //  判断是往上走还是往下走。
    // 前提条件，已经确定不是横向操作   返回值：真 表示往上走
    isAssault(fromInd, toInd) {
        if (fromInd > toInd) {
            return true;
        } else {
            return false;
        }
    },


    //      棋子是否被卡位置，是否被别腿  马，象
    NClipCheck(fromInd,toInd,boardStr = this.boardString){
        this.boardString = boardStr;
        let distance = toInd - fromInd;
        switch (distance) {
            case 19:
            case 17:
                // 判定是否别腿
                return this.isNullInBoard(fromInd - 9);
            case 11:
            case -7:
                return this.isNullInBoard(fromInd - 1);
            case 7:
            case -11:
                return this.isNullInBoard(fromInd + 1);
            case -19:
            case -17:
                return this.isNullInBoard(fromInd + 9);
            default:
                return false;
        }
    },
    BClipCheck(fromInd,toInd,boardStr = this.boardString){
        this.boardString = boardStr;

        //判断，只能走一步。
        let distance = Math.abs((toPiece - fromPiece));
        if (distance == 20 || distance == 16) {
            //判断别腿
            //判断这步棋是前进还是后退，，进位就减，退位就加  得出别腿位置的坐标
            // 判定前进还是后退   返回别腿位置是否为空  为空就可以走
            if (this.isAssault(fromPiece,toPiece)){
                return  this.isNullStr(fromPiece - distance /2);
            }else {
                return this.isNullStr(fromPiece +  distance /2);
            }
        }
    },

    //    判断在该字符串中是否是红方，黑方，空
    isRedInBoard(ind,boardStr = this.boardString){
        let x = Math.floor(ind / 9);
        let y = ind % 9;
        return this.isRedStr(boardStr[x][y]);
    },
    isBlackInBoard(ind,boardStr = this.boardString){
        let x = Math.floor(ind / 9);
        let y = ind % 9;
        return this.isBlackStr(boardStr[x][y]);
    },
    //  判断棋局中指定位置是否为空
    isNullInBoard(ind,boardStr = this.boardString) {
        let x = Math.floor(ind / 9);
        let y = ind % 9;
        return this.isNullStr(boardStr[x][y]);
    },


    //    判断该字符是否是红方，黑方，空
    isRedStr(pieceStr){
        let rStr = ["K","A","B","N","R","C","P"];
        if (typeof pieceStr === "string"){
            if (pieceStr == pieceStr.toUpperCase()){
                if (pieceStr in rStr){
                    return true;
                }
            }
        }
        return false;
    },
    isBlackStr(pieceStr){
        let rStr = ["k","a","b","n","r","c","p"];
        if (typeof pieceStr == "string"){
            if (pieceStr == pieceStr.toUpperCase()){
                if (pieceStr in rStr){
                    return true;
                }
            }
        }
        return false;
    },
    isNullStr(pieceStr) {
        if (pieceStr == "0") {
            return true;
        }
    },
    //     判断这两个字符是否是同一方，  主要用于走步时判断
    isSameColor(formInd,toInd,boardstr = this.boardString){
        this.boardString = boardstr;
        //      目标为空，肯定不同，可以走步
        if (this.isNullStr(toInd)){
            return false;
        }
        //      两个棋子是否不同？
        if (this.isRedStr(formInd)){
            //      起点为红，，终点必须为黑
            if (this.isBlackStr(toInd)){
                return  false;
            }
        }else {
            //      起点为黑，，终点必须为红
            if(this.isRedStr(toInd)){
                return  false;
            }
        }
        //     同一阵营
        return true;
    }

}

//  判断走步有效性   为真，表示有效，  为假，表示走步无效   依赖全局变量，formPiece与toPiece
function walkCheck(){
    // 确定棋子的阵营了。
    //等待确认棋子的有效性

    //获取棋子类型
    let pieceName = $("#boardBox")[0].children[fromPiece].dataset.name;
    //判断棋子到目标棋子合法
    if (pieceWalkCheck(pieceName)){
        //  走步可以走，不别腿

        // 确保棋子走动后，不会将死
        let operation = [fromPiece,
            toPiece,
            $(".pieces")[fromPiece].getAttribute("data-name"),
            $(".pieces")[toPiece].getAttribute("data-name")];

        let boardString = ruleCheck.updateBoardString(operation,boardInit);

        //   函数会判断是否被将死，能被将死，返回真。   所有需要反转一下，因为为假才走步无效。
        return  !hopelessCaseCheck(userIsRed,boardString);
    }

    //  真表示可以通过，  假表示不行，没有通过。
    return false;
}


//传入棋局，判断是否被将死  无参就是验证现在的棋局，有参就验证参数的棋局,
//  棋局被将死返回真
function hopelessCaseCheck(userColorStatus,boardString,){
    let boardTem;
    if (boardString == undefined){
        boardTem = boardInit;
    }else {
        boardTem = boardString;
    }
    // 开始验证棋局

    //   首先排除将帅对面
    if (ruleCheck.isKMeetk(boardString)){
        return true;
    }
    //  进行浅预测，看看是否满足攻击前提
    if (PiecesPremiseCheck(boardTem,userColorStatus)){
        // 深度检测，看看是否被将？
        return isCheckMate(userColorStatus,boardString);
    }
    return false;
}


//判断是否将死            真表示没有被将死，还有步可以走，  假表示被将死
function isCheckMate(userColor,boardString){
    //   获取当前用户的可选棋子数组
    //   各方分别获取自己的各个剩余子力。

    //  棋子索引        二维数组
    let premisesList = [];
    //  棋子范围获取      三维数组
    let premiseScopeList = [];

    //  棋子类型
    let piecesCharList = [];
    //  根据阵营，初始化字符数组
    if (userColor) {
        // piecesCharList = ["n", "r", "c", "p"];
        piecesCharList = ["k","a","b","n","r","c","p"];
    } else {
        piecesCharList = ["K","A","B","N","R","C","P"];
    }

    //  获取各个种类棋子的索引数组
    for (let i = 0; i < piecesCharList.length; i++) {
        premisesList[i] = ruleCheck.charIndexInString(piecesCharList[i], boardString);
        premiseScopeList[i]= [];
        premisesList[i].forEach(function (){
            premiseScopeList[i].push([]);
        })
    }
    //  数据示例
    //  let premisesList = [
    //      [23,43],
    //      [45,43],
    //      [45,43],
    //      [45,43,56,75,68],
    //
    //
    // let premiseScopeList =[
    //     [[],[]],
    //     [[],[]],
    //     [[],[]],
    //     [[],[]],
    //     [[],[],[],[],[]],
    // ]

    let indArray = [];
    //  根据各个类型的数组和对应的索引  获取可走范围
    for (let i = 0; i < premisesList.length; i++) {
        indArray = premisesList[i];
        if (indArray.length > 0) {
            for (let j = 0; j < premisesList[i].length; j++) {
                //   获取并转为可走范围
                //  棋子类型，棋子索引，棋局
                premiseScopeList[i][j] = ruleCheck.getMobileSpaceByType(piecesCharList[i],premisesList[i][j],boardString);
            }
        }
    }

    let isCheckMateCheck = true;      //          是否被将死？

    for (let i = 0; i < premisesList.length; i++) {
        //  没被将死，还有可走棋子，结束判定
        if (!isCheckMateCheck) break;
        //   循环每种棋子
        indArray = premisesList[i];
        if (indArray.length > 0) {
            for (let j = 0; j < premisesList[i].length; j++) {
                if (!isCheckMateCheck) break;
                //      循环每种棋子中的每个棋子
                for (let l = 0; l < premiseScopeList[i][j].length; l++) {
                    if (!isCheckMateCheck) break;
                    //      判定是否被将军 起始位置是premisesList[i][j]  premiseScopeList[i][j][l]  棋局不变
                    if (!ruleCheck.simulateWalk(premisesList[i][j],premiseScopeList[i][j][l],piecesCharList[i],boardString)){
                        isCheckMateCheck = true;        // 有一次模拟走步不被将军，没有被将死
                    }
                }
            }
        }

    }
    return isCheckMateCheck;
}

//# region   棋子走步有效性,确保能走，不被卡位就行，不判断是否将死
// 需要前提条件，目标位置为非本阵营   真表示可以走，假表示不能走

//   棋子走法验证   需要全局布局   起点和落点位置   棋子类型   真表示可以走，假表示不能走
function pieceWalkCheck(pieceName) {
    // 将棋子转为大写  这一步是走法判断，阵营不做考虑
    pieceName = pieceName.toUpperCase();
    let userColorStatus = userIsRed;
    // console.log(pieceName);
    let walkStatus = false;
    switch (pieceName){
        case "K":
            walkStatus = KPieceCheck(userColorStatus);
            break;
        case "A":
            walkStatus = APieceCheck(userColorStatus);
            break;
        case "B":
            walkStatus = BPieceCheck(userColorStatus);
            break;
        case "N":
            walkStatus = NPieceCheck();
            break;
        case "R":
            walkStatus = RPieceCheck();
            break;
        case "C":
            walkStatus = CPieceCheck(userColorStatus);
            break;
        case "P":
            walkStatus = PPieceCheck(userColorStatus);
            break;
        default:
            walkStatus =false;
            console.log("系统异常，读取到异常的棋子。");
            break;
    }
    return walkStatus;
}

//  帅 ，  将 的验证
function KPieceCheck(userColorStatus) {
    let walkPlace;
    //首先判断这一步是什么阵营
    //因为是走步，所以肯定是当前用户在操作，只需判定用户是红方或黑方就可以了。
    // 得出一维数组
    if (userColorStatus) {
        //帅
        walkPlace = [3, 4, 5,12, 13, 14,21, 22, 23];
    } else {
        //将
        walkPlace = [66, 67, 68,75, 76, 77,84, 85, 86];
    }
    //判断目标地点在数组中。
    if (walkPlace.includes(toPiece)) {
        //判断，只能走一步。
        let distance = Math.abs((toPiece - fromPiece));
        if (distance == 9 || distance == 1) {
            //走一步，上下是9，左右移动是1，其他都是非法走步。
            //棋子可以走，但不能保证不被将死
            return true;
        }
    }
    return false;
}
//  士的验证
function APieceCheck(userColorStatus) {
    let walkPlace;
    //阵营判断
    //首先 得出一维数组
    if (userColorStatus) {
        walkPlace = [3, 5, 13, 21, 23];
    } else {
        walkPlace = [66, 68, 76, 84, 86];
    }
    if (walkPlace.includes(toPiece)) {
        //判断，只能走一步。
        let distance = Math.abs((toPiece - fromPiece));
        if (distance == 10 || distance == 8) {
            //走一步，分别是-10，-8,8,10其他都是非法走步。
            //棋子可以走，但不能保证不被将死
            return true;
        }
    }
    return false;
}
//  相 ， 象 的验证
function BPieceCheck(userColorStatus){
    let walkPlace;
    //阵营判断
    //首先 得出一维数组
    if (userColorStatus) {
        walkPlace = [2, 6, 18, 22, 26, 38, 42];
    } else {
        walkPlace = [47, 51, 63, 67, 71, 83, 87];
    }
    if(walkPlace.includes(toPiece)) {
        //判断，只能走一步。
        let distance = Math.abs((toPiece - fromPiece));
        if (distance == 20 || distance == 16) {
            //走一步，上下是9，左右移动是1，其他都是非法走步。
            //棋子可以走，但不能保证不被将死

            //判断别腿
            //判断这步棋是前进还是后退，，进位就减，退位就加  得出别腿位置的坐标
            // 判定前进还是后退   返回别腿位置是否为空  为空就可以走
            if (ruleCheck.isAssault(fromPiece,toPiece)){
                return  isNullPiece(fromPiece - distance /2);
            }else {
                return  isNullPiece(fromPiece +  distance /2);
            }
        }
    }
    return false;
}
//马的验证
function NPieceCheck() {
    // 马 走日。
    //  主要区分  横向的日和纵向的日。
    //   日的上下，左右，总共有八个落子点。   八个落子点伴有四个别腿点。
    // 判断是否别腿后，就是有效的 。

    // 计算棋子索引差
    let distance = fromPiece - toPiece;
    switch (distance) {
        case 19:
        case 17:
            // 判定是否别腿
            return isNullPiece(fromPiece - 9);
        case 11:
        case -7:
            return isNullPiece(fromPiece - 1);
        case 7:
        case -11:
            return isNullPiece(fromPiece + 1);
        case -19:
        case -17:
            return isNullPiece(fromPiece + 9);
        default:
            return false;
    }
}
//车的验证
function RPieceCheck(){
    let isStraight = false;
    // 是否是横向？
    let horizontalStatus = ruleCheck.isHorizontal(fromPiece,toPiece);
    //  是否是横向
    if (!horizontalStatus){
        //  是否是直线
        isStraight =  isVertical(fromPiece,toPiece);
    }else {
        // 横向自动是直线，不需要判断
        isStraight = true;
    }
    //  行进轨迹笔直   判定间隔之间没有棋子即可移动
    if (isStraight){
        if (intervalSum(horizontalStatus,fromPiece,toPiece) == 0){
            return true;
        }
    }
    return false;
}
//炮的验证
function CPieceCheck(userColorStatus) {
    let isStraight = false;
    // 是否是横向？
    let horizontalStatus = ruleCheck.isHorizontal(fromPiece, toPiece);
    //  是否是横向
    if (!horizontalStatus) {
        //  是否是直线
        isStraight = isVertical(fromPiece, toPiece);
    }else {
        // 横向自动是直线，不需要判断
        isStraight = true;
    }
    //  行进轨迹笔直   判定间隔之间没有棋子即可移动
    if (isStraight) {
        let piecesSum = intervalSum(horizontalStatus, fromPiece, toPiece);
        if (piecesSum == 0 ) {
            return true;
        }else if (piecesSum == 1){
            //  目标位置必须是对方的棋子   对方肯定不是本人，本人的对立面就是对方。
            // 这个验证只能用于验证自己走棋，
            return chessWithUser(toPiece,(!userColorStatus));
        }
    }
    return false;
}
//兵的验证
function PPieceCheck(userColorStatus){
    //前进的棋子   原点的棋子
    let advancePiece;
    let originPiece;
    // 判定红方黑方
    if (userColorStatus) {
        originPiece = fromPiece;
        advancePiece = toPiece;
    } else {
        advancePiece = fromPiece;
        originPiece = toPiece;
    }
    // 判定是前进，不是后退。
    if (Math.floor(advancePiece/9) >= Math.floor(originPiece/9)){
        // 判定是否只走了一格
        // 换行为9  左右为1   不会出现-9
        let intervalLen = Math.abs(advancePiece - originPiece);
        if (intervalLen == 9 || intervalLen ==1){
            return true;
        }
    }
    return false;
}


//# endregion

//#region 棋子判定 方向？直？间隔？上下？

// 判断纵向是不是笔直的？
// 返回值：真 表示是 竖直 的。
function isVertical(fromIndex,toIndex){
    // 判断纵向是不是笔直的， 即  除9得的的余数是否相同。
    if ((fromIndex % 9) === (toIndex % 9)) {
        return true;
    }
    return false;
}

// 判断之间有几颗棋子  0还是1
// 形参： 是不是横向，起点，终点，
// 前提条件： 横平竖直
// 返回值： 棋子数量
function intervalSum(isHorizontalStatus, fromIndex, toIndex) {
    // 之间间隔的棋子数量
    let piecesSum = 0;

    // 靠左边的索引  靠上边的
    let smallIndex = Math.min(fromIndex,toIndex);
    //  棋子之间的距离
    let intervalLen = 0;
    if (isHorizontalStatus){
        //横向
        intervalLen = Math.abs(fromIndex - toIndex);
        // 往左移的
        for (let i = 1; i < intervalLen; i++) {
            // 判断该索引是否为空   不为空  加一
            if (!isNullPiece(smallIndex + i)) {
                piecesSum++;
            }
        }
    }else {
        //纵向

        //  计算一维差距
        intervalLen = Math.abs(fromIndex - toIndex);
        //  一维差距计算得出二维差距
        intervalLen = Math.floor(intervalLen/9);
        // 往左移的
        for (let i = 1; i < intervalLen; i++) {
            // 判断该索引是否为空   不为空  加一
            if (!isNullPiece(smallIndex + i*9)) {
                piecesSum++;
            }
        }
    }
    return piecesSum;

}

//#endregion

//#region   用于判定是否进入攻击范围，是否需要判定将死？    稍微多余，  只能省一点点性能和步骤

// 将每个棋子遍历，判定是否攻击中。   是否进入攻击范围？
function PiecesPremiseCheck(boardStr,userColorStatus){
    let piecesCharList = [];
    let charIndexList = [];
    if (userColorStatus){
        piecesCharList = ["n","r","c","p"];
    }else {
        piecesCharList = ["N","R","C","P"];
    }
    //  以此遍历各个种类的棋子
    for (let i = 0; i < piecesCharList.length; i++) {
        // 获取该棋子的索引数组
        charIndexList = ruleCheck.charIndexInString(piecesCharList[i],boardStr);
        //  依次对各个棋子进行判断
        // 判断该棋子是否进入攻击范围？
        for (let j = 0;j<charIndexList.length;j++){
            //   如果有一项为真，即为真
            if (switchPremises(piecesCharList[i],userColorStatus,charIndexList[j])){
                return  true;
            }
        }

    }
    return false;
}

//  根据各个棋子类型，转向对应的判定函数
function switchPremises(premiseType,isRedStatus, indexPie){
    if (premiseType == "n" || premiseType == "N"){
        return NPremiseCheck(isRedStatus, indexPie);
    }else if (premiseType == "r" || premiseType == "R"){
        return RPremiseCheck(isRedStatus, indexPie);
    }else if(premiseType == "c" || premiseType == "C"){
        return RPremiseCheck(isRedStatus, indexPie);
    }else if(premiseType == "p" || premiseType == "P"){
        return PPremiseCheck(isRedStatus, indexPie);
    }
}

//  检查马是否进入攻击范围
function NPremiseCheck(isRedStatus, indexPie) {
    //   棋子必须在第二列到第八列中
    // 红马
    if (indexPie % 9 > 0 && indexPie % 9 < 8) {
        if (isRedStatus) {
            if (indexPie / 9 >= 5) {
                //  红马
                // 去除角落的情况
                if (indexPie % 9 != 46 && indexPie != 52) {
                    // 满足前提条件
                    return true;
                }
            }
        } else {
            if (indexPie / 9 < 5) {
                // 去除角落的情况
                if (indexPie % 9 != 37 && indexPie != 43) {
                    // 满足前提条件
                    return true;
                }
            }
        }

    }
    // 不满足前提条件
    return false;
}

//  检查车、炮是否进入攻击范围
function RPremiseCheck(isRedStatus, indexPie) {
    if (isRedStatus){
        //   是否在8、9、10 行？   是否在3、4、5列？
        if (indexPie / 9 >= 7 || (2 < (indexPie % 9) && (indexPie % 9) < 6)) {
            return true;
        }
    }else {
        //   是否在8、9、10 行？   是否在3、4、5列？
        if (indexPie / 9 < 3 || (2 < (indexPie % 9) && (indexPie % 9) < 6)) {
            return true;
        }
    }
    return false;
}
//  检查兵是否进入攻击范围
function PPremiseCheck(isRedStatus, indexPie) {
    if (isRedStatus){
        //   是否在6，7、8、9、10 行？   是否在3、4、5列？
        if (indexPie / 9 >= 6 && (1 < (indexPie % 9) && (indexPie % 9) < 7)) {
            return true;
        }
    }else {
        //   是否在8、9、10 行？   是否在3、4、5列？
        if (indexPie / 9 < 4 && (1 < (indexPie % 9) && (indexPie % 9) < 7)) {
            return true;
        }
    }
    return false;
}

//#endregion

// 执行走步操作       只负责走，不负责验证
function executeWalk() {
    let operation = [fromPiece, toPiece,
        boardInit.join("")[fromPiece], boardInit.join("")[toPiece],];
    // 存储这一步
    pieceStep.push(operation);
    // 存储局面  将 起点设为空，终点位置覆盖
    boardInit = ruleCheck.goForward(pieceStep[pieceStep.length - 1], boardInit);
    //  根据布局 渲染页面
    updateBoardHtml.updateBoard(boardInit);
    //改变该谁下棋        //改变定时器
    upHOfTimeMes.switchTimeManage();
}

//  根据布局数组渲染页面
let updateBoardHtml = {
//  主方法读取字符串，渲染棋局
    updateBoard(boardNow) {
        for (let y = 0; y < boardNow.length; y++) {
            for (let x = 0; x < boardNow[y].length; x++) {
                // console.log("X:"+x+",Y:"+y+"board:"+boardNow[y][x]);
                // 两个形参，一个计算索引，一个得到数组中的字符
                //方法将对应索引的棋子渲染
                updatePieceHtml.addPiece((x + y * 9), this.getClassName(boardNow[y][x]));
            }
        }
    },
    getClassName(pieChar) {
        if (pieChar >= "A" && pieChar <= "Z") {
            return "B" + pieChar;
        } else if (pieChar >= "a" && pieChar <= "z") {
            return "R" + pieChar;
        } else {
            // console.log("空位");
            return "airPie";
        }
    },

}
//  修改棋子页面信息
let updatePieceHtml = {
    //将对应索引的盒子添加图片，添加data信息
    addPiece(indPiece, pieClassName) {
        // console.log("indPiece:"+indPiece+",pieClassName:"+pieClassName);
        $(".pieces")[indPiece].style.backgroundImage = 'URL("imgPieces/' + pieClassName + '.png")';
        $(".pieces")[indPiece].style.backgroundSize = "100% 100%";
        $(".pieces")[indPiece].dataset.camp = pieClassName[0];
        $(".pieces")[indPiece].dataset.name = pieClassName[1];
        $(".pieces")[indPiece].dataset.index = indPiece;
    },
}
//  对战提示信息
let gameHint = {
    //  显示提示信息      形参：字体颜色，提示信息，出现时间，消失时间
    hintModelShow(colorStr,hintString,showTime,fadeTime){
        $("#walkHintBox p")[0].innerText = hintString;
        $("#walkHintBox p")[0].style.color = colorStr;
        $("#walkHintBox").fadeToggle(showTime);
        $("#walkHintBox").fadeToggle(fadeTime);
    },
    //  无效走步
    greyHintShow(hintString){
        this.hintModelShow("grey",hintString,500,1000);
    },
    //
    blackHintShow(hintString){
        this.hintModelShow("black",hintString,500,2000);
    },
    //  和棋  将军
    orangeHintShow(hintString){
        this.hintModelShow("orange",hintString,500,4000);
    },
    //  败
    redHintShow(hintString){
        this.hintModelShow("red",hintString,500,10000);
    },
    //  胜
    greenHintShow(hintString){
        this.hintModelShow("green",hintString,500,10000);
    },

}

//  发送棋局信息工具函数，发送棋局信息
function sendBoard(boardNumb, boardStr) {
//  发送者和接收者固定，改变信号和棋局。
    let msg = {
        "msgType": boardNumb,
        "sender": userName,
        "receiver": warUserName,
        "msgString": boardStr,
    };
    //发送给后端
    webSocket.send(JSON.stringify(msg));
}

//      定时器       true表示该红方。   需要调用认输函数，在时间到后，一方认输,参数是败方的布尔值。
let upHOfTimeMes = {

    //  用于切换定时器     真表示红方定时器启动，假表示黑方定时器启动
    userColorStatus:true,
    //  用于暂停和启动定时器
    startStatus:false,

    //      存储红方和黑方的时间
    redTime:600,
    blackTime:600,
    //      存储红方和黑方定时器的唯一标识     //      存储setInterval()方法的唯一标识
    redTimeOpen:null,
    blackTimeOpen:null,
    //      存储外部的认输函数
    giveUpClick:function (){    },


    //  定时器 红方和黑方
    timeManageRed() {
        if (typeof this.redTime.time === "number"){
            if (this.redTime.time < 0){
                //      定时器自检
                this.giveUpClick(this.userColorStatus); // 超时，开始收摊      调用认输按钮的单击事件
            }
        }else {
            this.redTime.time = 600;
            this.startStatus = false;
            console.log("定时器启动异常");
        }
        //      定时器计时
        if (this.userColorStatus && this.startStatus) {
            //      修改定时器显示时间
            upHOfTimeMes.upHOfRedTime(this.redTime);
            this.redTime--;
            this.redTimeOpen = setTimeout('this.timeManageRed()', 1000);
        } else {
            //  暂停定时器A
            if (this.redTimeOpen != null) clearInterval(this.redTimeOpen);
        }
    },
    timeManageBlack(){
        if (typeof this.blackTime.time === "number"){
            if (this.blackTime.time < 0){    //      定时器自检
                this.giveUpClick(this.userColorStatus);     // 超时，开始收摊      调用认输按钮的单击事件
            }
        }else {
            this.blackTime.time = 600;
            this.startStatus = false;
            console.log("定时器启动异常");
        }
        //      定时器计时
        if ((!this.userColorStatus) && this.startStatus) {
            upHOfTimeMes.upHOfRedTime(this.blackTime);  //      修改定时器显示时间
            this.blackTime--;
            this.blackTimeOpen = setTimeout('this.timeManageBlack()', 1000);
        } else {
            //  暂停定时器A
            if (this.blackTimeOpen != null) clearInterval(this.blackTimeOpen);
        }
    },

    //      切换定时器       无参，直接切换     有参，切换为对应定时器
    switchTimeManage(userTakeColor = !this.userColorStatus){
        this.userColorStatus = userTakeColor;
        this.timeManageRed();
        this.timeManageBlack();
    },
    //   暂停或启动定时器， 为真  启动  为假   暂停
    pauseOrStartTime(timeStatus) {
        if (timeStatus) {
            //  为真，启动一方定时器
            this.startStatus = timeStatus;
            this.timeManageRed();
            this.timeManageBlack();
        } else {
            //为假，暂停所有定时器
            this.startStatus = timeStatus;
            this.timeManageRed();
            this.timeManageBlack();
        }
    },
    //   重置定时器
    resetTime(timeNum){
        this.pauseOrStartTime(false);
        this.redTime = timeNum;
        this.blackTime = timeNum;
    },


    //  修改红方的时间     //  形参：秒
    upHOfRedTime(timeNum){
        if (( typeof timeNum)==="number"){
            document.getElementById("rTime").innerHTML = this.timeNumToStr(timeNum);
        }else {
            console.log("时间设置错误");
        }
    },
    //  修改黑方的时间     //  形参：秒
    upHOfBlackTime(timeNum){
        if (( typeof timeNum)==="number"){
            document.getElementById("BTime").innerHTML =    this.timeNumToStr(timeNum);
        }else {
            console.log("时间设置错误");
        }
    },
    //   将时间秒转为字符格式的字符串
    timeNumToStr(timeNum) {
        let m = parseInt(timeNum / 60);
        let s = timeNum % 60;
        m = this.checkTime(m);
        s =  this.checkTime(s);
        return m + ":" + s;
    },
    //     小于10的话，前面加0
    checkTime(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i
    },
}



//#region   用户走步提示提示函数   弃用
// walkHintShow("你输了","red");
// walkHintShow("无效走步",1);
// walkHintShow("将军",3);
// walkHintShow("和棋",3);
// walkHintShow("败",4);
// walkHintShow("胜",5);
//  提示语最长7个字
// walkHintShow("无效走步无效走",4);

//  提示信息框，  参数一表示提示语，参数二表示提示等级  1-5
// function walkHintShow(hintString, hintStatus) {
//     $("#walkHintBox p")[0].innerText = hintString;
//     switch (hintStatus) {
//         case 1:
//             $("#walkHintBox p")[0].style.color = "grey";
//             $("#walkHintBox").fadeToggle(500);
//             $("#walkHintBox").fadeToggle(1000);
//             break;
//         case 2:
//             $("#walkHintBox p")[0].style.color = "black";
//             $("#walkHintBox").fadeToggle(500);
//             $("#walkHintBox").fadeToggle(2000);
//             break;
//         case 3:
//             $("#walkHintBox p")[0].style.color = "orange";
//             $("#walkHintBox").fadeToggle(500);
//             $("#walkHintBox").fadeToggle(4000);
//             break;
//         case 4:
//             $("#walkHintBox p")[0].style.color = "red";
//             $("#walkHintBox").fadeToggle(500);
//             $("#walkHintBox").fadeToggle(10000);
//             break;
//         case 5:
//             $("#walkHintBox p")[0].style.color = "green";
//             $("#walkHintBox").fadeToggle(500);
//             $("#walkHintBox").fadeToggle(10000);
//             break;
//         default:
//             $("#walkHintBox").fadeToggle(100);
//             $("#walkHintBox").fadeToggle(2000);
//
//     }
// }
//#endregion
//#region   定时器       弃用
//改变计时器状态   空参，根据全局变量，  参数真代表红棋开始，  参数假代表黑棋开始
// function redUserOperation(userTakeColor) {
//     let timeNumStatus;
//     if (userTakeColor == undefined){
//         //  无参   切换下棋对象
//         userTakeStatus = !userTakeStatus;
//         timeNumStatus = userTakeStatus;
//     }else {
//         // 有参  选定下棋对象
//         userTakeStatus = userTakeColor;
//         timeNumStatus = userTakeColor;
//     }
//     pauseOrStartTime(true);
//     //计时器轮转
//     if (timeNumStatus) {
//         userTakeStatus = true;
//         timeManageRed();
//         timeManageBlack();
//     } else {
//         userTakeStatus = false;
//         timeManageRed();
//         timeManageBlack();
//     }
// }
//   暂停或启动定时器， 为真  暂停  为假，启动
// function pauseOrStartTime(timeStatus){
//     if (timeStatus){
//         //  为真，暂停所有定时器
//         userTakeStatus = false;
//         timeManageRed();
//         userTakeStatus = true;
//         timeManageBlack();
//     }else {
//         //为假，启动所有定时器
//         userTakeStatus = false;
//         timeManageBlack();
//         userTakeStatus = true;
//         timeManageRed();
//     }
// }

//   重置定时器
// function resetTime(){
//     pauseOrStartTime(true);
//     timeManageRed.time = 600;
//     timeManageBlack.time = 600;
//     document.getElementById("rTime").innerHTML = "00:00"
//     document.getElementById("BTime").innerHTML = "00:00"
//
// }


//定时器A
// function timeManageRed() {
//     let timeOpen;
//     let timeClose;
//     if (timeManageRed.time<0){
//         // 超时，开始收摊
//         giveUpClick()
//
//     }
//     if (userTakeStatus) {
//         //      修改定时器显示时间
//         upHOfTimeMes.upHOfRedTime(timeManageRed.timeOpen);
//         timeManageRed.time--;
//         timeManageRed.timeOpen = setTimeout('timeManageRed()', 1000)
//     } else {
//         timeClose = clearInterval(timeManageRed.timeOpen);
//     }
// }
//
// timeManageRed.time = 600;

//定时器B
// function timeManageBlack() {
//     //  存储setInerval()方法的唯一标识
//     let timeOpen;
//     let timeClose;
//     if (timeManageBlack.time<0){
//         // 超时，开始收摊
//         giveUpClick()
//     }
//     if (!userTakeStatus) {
//         //      修改定时器显示时间
//         upHOfTimeMes.upHOfBlackTime(timeManageRed.timeOpen);
//         timeManageBlack.time--;
//         timeManageBlack.timeOpen = setTimeout('timeManageBlack()', 1000)
//     } else {
//         //   clearInterval()方法能够取消setInterval()方法设置的定时器。
//         timeClose = clearInterval(timeManageBlack.timeOpen);
//     }
// }
// timeManageBlack.time = 600;
//#endregion