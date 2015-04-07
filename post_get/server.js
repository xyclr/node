var httpserver = require("http");
var qs = require("querystring");
var url = require("url");
var fs = require("fs");

httpserver.createServer(onRequest).listen(8081);

function onRequest(request,response)
{
    var pathname = url.parse(request.url).pathname;
    if(pathname=="/")	//访问表单页面
    {
        response.writeHead(200,{"Content-Type":"text/html"});
        fs.readFile("index.html","utf-8",function(e,data){
            response.write(data);
            response.end();
        });
    }
    else if(pathname=="/postlogin")	//处理post方式请求
    {
        var a="";
        request.on("data",function(postdata){
            a+=postdata;	//接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
            var b = qs.parse(a);		//转换成json对象
            var c = decodeURIComponent(a);		//对表单数据进行解码
            console.log(a);
            console.log(b);
            console.log(c);
            a = c;
        });
        request.on("end",function(){
            response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
            response.write(a);
            response.end();
        });
    }
    else if(pathname=="/getlogin")	//处理get方式请求
    {
        var a = url.parse(request.url).query;
        var b = qs.parse(a);
        var c = decodeURIComponent(a);

        console.log(a);
        console.log(b);
        console.log(c);
        a = c;

        response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"});
        response.write(a);
        response.end();
    }
    else
    {
        response.writeHead(200,{"Content-Type":"text/plain"});
        response.write("error");
        response.end();
    }
}