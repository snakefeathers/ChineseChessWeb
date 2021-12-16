console.log("index.js文件引入测试");

//项目地址
const objectUrl = "/CP";

//登录按钮ID
let loginButtonId = "nav_li_login";
//下拉框ID
let comboboxId = "nav_li_down";
//退出按钮ID
let exitButtonId = "nav_li_a_exit";
//用户名对应的cookie名
let userNameConk = 'userName';
//定义链接数组
let hrefAndUrl = new Array("/index","/board","/conversation","/consult");


//#region   导航单击事件

//移除class值“active”的选中效果。
function wipeActive(elementId){
    //结构为   ul————》li————》a,传值为a的ID，根据id获取父元素的父元素，得到祖父级别元素。
    let grandFatherElement = document.getElementById(elementId).parentNode.parentNode;
    //获取祖父元素中所有li类型的子元素，得到li元素的数组。
    let fatherElement = grandFatherElement.getElementsByTagName("li");
    //遍历一个个li元素，移除该class值。
    for (let liIndex = fatherElement.length-1 ; liIndex >= 0 ; liIndex--) {
        //移除每个元素的class。
        fatherElement[liIndex].classList.remove("active");
    }
}
//将点击的选项添加class效果
function addActive(elementId){
    //获取单击的a元素
    let ziTest = document.getElementById(elementId);
    //获取a元素的父元素，li元素
    let fuTest = ziTest.parentNode;
    //给li元素添加active，生成选中效果。
    fuTest.className = "active";
}
//隐藏目前页面主体
function noneBody() {
    //获取所有主体
    let pageBodyList = document.getElementsByClassName("pageBody");
    //遍历所有主体，将每个主体的“display”属性设置为“none”。
    for (let i = 0; i < pageBodyList.length; i++) {
        pageBodyList[i].style.display = "none";
    }
}
//查看点击元素的索引
function indexOfElement(elementId){
    //获取父级元素“li"
    let childElement = document.getElementById(elementId).parentNode;
    //获取“li"元素的父级元素”ul“
    let parentElement = childElement.parentNode;
    //查询目前这个“li”元素在“ul”元素下的“li”数组中的索引。
    let index = Array.prototype.indexOf.call(parentElement.children, childElement);
    return index;
}
//根据索引显示指定的页面主体
function blockBodyByIndex(indexOfE){
    //获取所有主体
    let pageBodyList = document.getElementsByClassName("pageBody");
    //将制定索引的元素的“display”属性改为“block”
    pageBodyList[indexOfE].style.display = "block";
}
//调用函数请求数据，根据数据渲染页面
function jump(indexOfE) {
    let dataB;
    //获取数据
    $.ajax({
        url: objectUrl + hrefAndUrl[indexOfE] + "/show",
        type: "POST",
        async: true,
        data: JSON.stringify({userNameTest: "admin", userPasswordTest: "123"}),//data表示发送的数据，此处数据为Json对象
        contentType: "application/json;charset=UTF-8",       //定义发送请求的数据格式为JSON字符串
        dataType: 'json',   //定义回调响应的数据格式为JSON字符串，可省略。
        success: function (data) {      //成功响应的结果
            if (data != null) {
                //将数据取出
                dataB = data[0];
                console.log("开始打印");
                console.log(data);
                console.log("开始打印");
                //根据索引调用对应的函数，将数据渲染进页面
                switch (indexOfE){
                    case 0:break;
                    case 1:
                        chineseChessShow(dataB);
                        break;
                    case 2:
                        invitationShow(dataB);
                        break;
                    case 3:
                        consultShow(dataB);
                        break;
                    default:break;
                }
            }else {
                console.log("没有获取数据")
            }
        }
    });
    invitationShow(dataBShow);
}
//单击方法-------总方法，调用这一块儿的函数
function  aOnClick(element){
    //获取点击元素的ID
    let elementId = element.id;
    //移除class值“active”的选中效果。
    wipeActive(elementId);

    //将点击的选项添加class效果
    addActive(elementId);

    //隐藏目前页面主体
    noneBody();

    //查看点击元素的索引
    let indexOfE = indexOfElement(elementId);

    //根据索引显示指定的页面主体
    blockBodyByIndex(indexOfE);

    //调用函数请求数据，根据数据渲染页面
    jump(indexOfE);
}

//#endregion





