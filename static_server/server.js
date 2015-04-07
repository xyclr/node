var http = require('http');
var parse =require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function (req,res){
    var url = parse(req.url);
    var path = join(root,url.pathname);
    var stream = fs.createReadStream(path);


   /* stream.on('data',function(chunk){
        res.write(chunk + "end \n");
    });

    stream.on('end',function(){
        res.end('end!!!')
    })*/

    fs.stat(path,function(err,stat){

        if(err){//目前还有问题，出错时，err为null
            if(err.code == 'ENOENT'){
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }

        } else {
            res.setHeader('Content-Length', stat.size);
            stream.pipe(res);
            stream.on('error',function(err){
                res.statusCode = 500;
                res.end('Internal Server Error');
            })
        }
    })


});
server.listen(3000,function(){
    console.log("listening on port: 3000")
});
