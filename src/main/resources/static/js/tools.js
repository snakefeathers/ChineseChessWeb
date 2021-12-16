

//region   根据数据动态生成表格


// data_ajax = [
//     {"userName":"admin0","password":"0123","userType":0,"test":"1"},
//     {"userName":"admin1","password":"1123","userType":1,"test":"1"},
//     {"userName":"admin2","password":"2123","userType":2,"test":"1"},
//     {"userName":"admin0","password":"0123","userType":0,"test":"1"},
//     {"userName":"admin1","password":"1123","userType":1,"test":"1"},
//     {"userName":"admin2","password":"2123","userType":2,"test":"1"},
//     {"userName":"admin0","password":"0123","userType":0,"test":"1"},
//     {"userName":"admin1","password":"1123","userType":1,"test":"1"},
//     {"userName":"admin2","password":"2123","userType":2,"test":"1"}
// ];
// text_title = "动态表格测试";
// id_table = "table_show_data";
// text_heads =["用户名","密码","类型","测试"];


//参数分别为（数据，表头，表格ID，表头别名）
// table_initialize(data_ajax,text_title,id_table,text_heads);

//表格初始化函数---主函数
function table_initialize(data_ajax,text_title,table_id){
    //获取表格对象
    let table_show = document.getElementById(table_id);
    //获取表头
    let keys = Object.keys(data_ajax[0]);


    caption_initialize(table_show,text_title);
    thead_initialize(table_show,text_heads);
    tbody_initialize(table_show,data_ajax,keys);
}
//标题初始化函数
//参数（表格对象，标题）
function caption_initialize(table_show,text_title){
    let element_caption = document.createElement("caption");
    element_caption.innerText = text_title;
    if (table_show.getElementsByTagName("caption").length<1){        //判断：如果为空，添加。如果不为空，移除已有的，添加新的
        table_show.appendChild(element_caption);
    }else {
        table_show.removeChild("caption");
        table_show.appendChild(element_caption);
    }
}
//表头初始化函数
//参数（表格对象，表头别名）
function thead_initialize(table_show,text_heads){
    let element_thead = document.createElement("thead");
    //定义th元素临时变量
    let th_template;
    //根据keys添加表头
    for (let cow=0; cow<text_heads.length;cow++){
        th_template = document.createElement("th");
        th_template.innerText = text_heads[cow];
        element_thead.appendChild(th_template);
    }
    //表格进行非空校验后添加表头元素
    if (table_show.getElementsByTagName("thead").length<1){         //判断：如果为空，添加。如果不为空，移除已有的，添加新的
        table_show.appendChild(element_thead);
    }else {
        table_show.removeChild("thead");
        table_show.appendChild(element_thead);
    }
}
//表格初始化函数
//参数（表格对象，数据，表头）
function tbody_initialize(table_show,data_ajax,keys){
    //创建tbody元素
    let element_tbody = document.createElement("tbody");

    //行长度，根据数组长度
    let length_row = data_ajax.length;
    //列长度，根据key的长度
    let length_cow = keys.length;
    //定义tr和td元素的临时变量
    let tr_temporary;
    let td_temporary;
    //添加tr和td元素
    for (let row = 0; row < length_row; row++) {
        //tr元素初始化
        //————————————————————————————调用自定义函数
        tr_temporary = tr_initialize(row);
        for (let cow = 0; cow < length_cow; cow++) {
            //td元素初始化
            //————————————————————————————调用自定义函数
            td_temporary = td_initialize(data_ajax,keys,row,cow);
            //添加td元素到tr中
            tr_temporary.appendChild(td_temporary);
        }
        //添加tr元素到tbody中
        element_tbody.appendChild(tr_temporary);
    }
    //将tbody元素添加到表格中
    if (table_show.getElementsByTagName("tbody").length<1){         //判断：如果为空，添加。如果不为空，移除已有的，添加新的
        table_show.appendChild(element_tbody);
    }else {
        table_show.removeChild("tbody");
        table_show.appendChild(element_tbody);
    }
}

//tr元素初始化函数
//参数（表格对象，行号）
function tr_initialize(row){
    let element_tr = document.createElement("tr");
    //设置id
    element_tr.id = "tr_"+row;
    return element_tr;
}
//td初始化函数
//参数（数据，表头，行号，列号）
function td_initialize(data_ajax,keys,row,cow){
    let element_td = document.createElement("td");
    //td元素传值
    element_td.innerText = data_ajax[row][keys[cow]];
    return element_td;
}


//endregion



//#region   动态插入外部js文件，     因为页面中也有部分相对链接，放弃使用

function addJSFile(){
    let urlList = ["js/jquery.min.js", "js/jquery.cookie.js", "bootstrap/js/bootstrap.min.js", "js/public.js", "js/navInit.js", "js/tools.js"];

    let localUrl = "http://localhost:8080/CP/";
    urlList.push("js/index.js");
    addScript(urlList, localUrl);


}
//根据端口号和路径数组给页面添加script导入元素
function addScript(urlList, localUrl) {
    let eleList = [];
    let scriptEle;

    //创建元素
    for (let i = 0; i < urlList.length; i++) {
        scriptEle = document.createElement('script');
        scriptEle.setAttribute('type', 'text/javascript');
        eleList.push(scriptEle);
    }
    //添加css
    let styleEle = document.createElement('link');
    styleEle.setAttribute("rel",'stylesheet');
    eleList.push(styleEle);


    //判断端口号为8080，相对地址转绝对地址
    if (location.port == '8080') {
        for (let i = 0; i < eleList.length; i++) {
            eleList[i].src = localUrl + urlList[i];
            console.log(eleList[i].src);
        }

        styleEle.setAttribute("href",localUrl+'bootstrap/css/bootstrap.min.css');
    }else {
        for (let i = 0; i < eleList.length; i++) {
            eleList[i].src =  urlList[i];
            console.log(eleList[i].src);
        }
        styleEle.setAttribute("href",'bootstrap/css/bootstrap.min.css');
    }


    //元素添加
    for (let i = 0; i < eleList.length; i++) {
        setTimeout(function () {
            document.getElementsByTagName('head')[0].appendChild(eleList[i]);
        }, i * 100);
    }



    //
    // // 如果端口号是8080
    // if (location.port != '8080') {
    //     for (let i = 0; i < urlList.length; i++) {
    //         scriptEle = document.createElement('script');
    //         scriptEle.setAttribute('type', 'text/javascript');
    //         scriptEle.setAttribute('src', urlList[i]);
    //         scriptList.push(scriptEle);
    //         setTimeout(function (){
    //             document.getElementsByTagName('head')[0].appendChild(scriptList[i]);
    //         }, i*100);
    //     }
    //     //添加css
    //     let styleEle = document.createElement('link');
    //     styleEle.setAttribute("rel",'stylesheet');
    //     styleEle.setAttribute("href",'bootstrap/css/bootstrap.min.css');
    //     document.getElementsByTagName('head')[0].appendChild(styleEle);
    // } else {
    //     // 如果不是
    //     for (let i = 0; i < urlList.length; i++) {
    //         scriptEle = document.createElement('script');
    //         scriptEle.setAttribute('type', 'text/javascript');
    //         //加入项目地址
    //         scriptEle.setAttribute('src', localUrl + urlList[i]);
    //         // document.getElementsByTagName('head')[0].appendChild(scriptEle);
    //         scriptList.push(scriptEle);
    //         setTimeout(function (){
    //             document.getElementsByTagName('head')[0].appendChild(scriptList[i]);
    //         }, i*100);
    //     }
    //添加css
    // let styleEle = document.createElement('link');
    // styleEle.setAttribute("rel",'stylesheet');
    // styleEle.setAttribute("href",localUrl+'bootstrap/css/bootstrap.min.css');
    // document.getElementsByTagName('head')[0].appendChild(styleEle);

}

//#endregion



