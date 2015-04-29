/**
 * Created by cdgoujianjun on 2015/3/10.
 */
var http = require('http');
var qs = require('querystring');
var items = [];

var server = http.createServer(function(req,res){
    if('/' == req.url){
        switch (req.method){
            case 'GET' :
                show(res);
                break;
            case 'POST' :
                add(req,res);
                break;
            default :
                badRequest(res);
        }
    } else {
        notFound(res);
    }
});
server.listen(3000,function(){
    console.info("listening port on : 3000")
});

function show(res) {
    var html = '<html><head><title>ToDoList</title></head><body><h1>To Do List</h1>' +
            '<ul>' + items.map(function(item){ return '<li>'+ item +'</li>'}).join('') +
            '</ul><form method="post" action="/"><input type="text" name="item" /><p><input type="file" name="file" /></p><input type="submit" value="add item" /></form>' +
            '</body></html>';
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
}

function add(req,res){
    var body = '';
    req.setEncoding('utf8');
    req.addListener('data',function(chunk){
        body +=chunk;
        console.info(chunk);
    });//问题：通过游览器访问无法进入data事件,input.text namew未设置
    req.addListener('end',function(){
        var obj = qs.parse(body);
        items.push(body);
        show(res);
    });

}

function badRequest(res){
    res.statusCode = 400;
    res.setHeader('Content-type','text/plain');
    res.end('badRequest');
}

function notFound(res){
    res.statusCode = 403;
    res.setHeader('Content-type','text/plain');
    res.end('not found');
}