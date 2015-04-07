var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'POST' :
            var item = '';
            req.setEncoding('utf8');
            req.on('data',function(chunk){
                item += chunk;
                console.info(chunk)
            });
            req.on('end',function(){
                items.push(item);
                res.end('ok\n');
            });
            break;
        case 'GET' :
            /*items.forEach(function(item,i){
                res.write(i + ': ' + item + '\n');
            });
            res.end("end");*/
            var body = items.map(function(item,i){
                return i + ':' + item;
            }).join('\n');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('Content-type','text/plain;charset="utf-8"');
            res.end(body);
            break;
        case 'DELETE' :
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);
            if(isNaN(i)) {
                res.status = 400;
                res.end('Invalid item id');
            } else if(!items[i]) {
                res.status = 400;
                res.end('Item not found!');
            } else {
                items.splice(i,1);
                res.end('OK\n');
            }
            break;
        case 'PUT' :
            var params = url.parse(req.url).path.split('?')[1].split('&');
            var param = params[0].split('=');
            items[param[0]] = param[1];
            res.end("end");
    }
});
server.listen(3000);