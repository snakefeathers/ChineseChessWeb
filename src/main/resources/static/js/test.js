
let dataInvitations =[
    {
        "invitationId": "7a1f10c5fa0a8020eae263fc07a4bded",
        "invitationTitle": "标题测试002",
        "creationTime": 1632153562000,
        "discussNum": 0,
        "pageView": 0,
        "invitationBody": "帖子正文部分测试。",
        "writerId": null,
        "status": 0
    },
    {
        "invitationId": "7a1f10c5fa1a8020eae263fc07a4bded",
        "invitationTitle": "标题测试001",
        "creationTime": 1632154597000,
        "discussNum": 0,
        "pageView": 0,
        "invitationBody": "帖子正文部分测试",
        "writerId": null,
        "status": 0
    },
    {
        "invitationId": "7a1f10c5fa1a8030eae263fc07a4bded",
        "invitationTitle": "标题测试",
        "creationTime": 1632158669000,
        "discussNum": 0,
        "pageView": 0,
        "invitationBody": "帖子正文部分测试",
        "writerId": null,
        "status": 0
    },
    {
        "invitationId": "ab8fef21ef11c436627ed988d7ecc565",
        "invitationTitle": "测试帖子",
        "creationTime": 1631910895000,
        "discussNum": 0,
        "pageView": 99,
        "invitationBody": "帖子正文部分。",
        "writerId": null,
        "status": 0
    },
    {
        "invitationId": "cc4c4c1fa600c6632ed52f6497ed2e7b",
        "invitationTitle": "标题测试",
        "creationTime": 1632278393000,
        "discussNum": 0,
        "pageView": 0,
        "invitationBody": "帖子正文部分测试。",
        "writerId": null,
        "status": 0
    }
];


//#region   动态script路径测试
function addUrl() {
    let urlList =["js/jquery.min.js","js/jquery.cookie.js","bootstrap/js/bootstrap.min.js","js/public.js","js/navInit.js","js/tools.js"];
    urlList.push("js/index.js");
    let localUrl = "http://localhost:8080/CP/";

    addScript(urlList,localUrl);
}

//根据端口号和路径数组给页面添加script导入元素
function addScript(urlList, localUrl) {
    let scriptEle;
    // 如果端口号是8080
    if (location.port != '8080') {
        for (let i = 0; i < urlList.length; i++) {
            scriptEle = document.createElement('script');
            scriptEle.setAttribute('type', 'text/javascript');
            scriptEle.setAttribute('src', urlList[i]);
            // document.getElementsByTagName('head')[0].appendChild(scriptEle);
            setTimeout(function (){
                document.getElementsByTagName('head')[0].appendChild(scriptEle);
                console.log(i);
            }, 5000);
        }
    } else {
        // 如果不是
        for (let i = 0; i < urlList.length; i++) {
            scriptEle = document.createElement('script');
            scriptEle.setAttribute('type', 'text/javascript');
            //加入项目地址
            scriptEle.setAttribute('src', localUrl + urlList[i]);
            // document.getElementsByTagName('head')[0].appendChild(scriptEle);
            setTimeout(function (){
                document.getElementsByTagName('head')[0].appendChild(scriptEle);
                console.log("2");
            }, 50);
        }
    }
}

//#endregion