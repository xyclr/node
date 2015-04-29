/*
var connect = require('connect');
var __dirname  = "";
var app = connect()
    .use('/files',connect.directory(__dirname + 'public',{icons:true, hidden:true}))
    .use('/files',connect.static(__dirname +'public',{hidden:true}));

app.listen(3000);*/


var url = require("url");
var fs = require("fs");
var path = require("path");
var http = require("http");
var mime = require("./mime").types;
var config = require("./config");
var zlib = require("zlib");

var PORT = 8000;
var server = http.createServer(function(request, response) {

    var pathname = url.parse(request.url).pathname;
    console.log(pathname);
    var realPath = path.join("public", pathname);



    fs.exists(realPath, function (exists) {

        if (!exists) {

            response.writeHead(404, "Not Found", {'Content-Type': 'text/plain'});

            response.write("This request URL " + pathname + " was not found on this server.");

            response.end();

        } else {

            var ext = path.extname(realPath);

            ext = ext ? ext.slice(1) : 'unknown';

            var contentType = mime[ext] || "text/plain";

            response.setHeader("Content-Type", contentType);



            fs.stat(realPath, function (err, stat) {

                var lastModified = stat.mtime.toUTCString();

                var ifModifiedSince = "If-Modified-Since".toLowerCase();

                response.setHeader("Last-Modified", lastModified);



                if (ext.match(config.Expires.fileMatch)) {

                    var expires = new Date();

                    expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);

                    response.setHeader("Expires", expires.toUTCString());

                    response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);

                }



                if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {

                    response.writeHead(304, "Not Modified");

                    response.end();

                } else {

                    fs.readFile(realPath, "binary", function(err, file) {

                        var raw = fs.createReadStream(realPath);

                        var acceptEncoding = request.headers['accept-encoding'] || "";

                        var matched = ext.match(config.Compress.match);



                        if (matched && acceptEncoding.match(/\bgzip\b/)) {

                            response.writeHead(200, "Ok", {'Content-Encoding': 'gzip'});

                            raw.pipe(zlib.createGzip()).pipe(response);

                        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

                            response.writeHead(200, "Ok", {'Content-Encoding': 'deflate'});

                            raw.pipe(zlib.createDeflate()).pipe(response);

                        } else {

                            response.writeHead(200, 'Ok');

                            raw.pipe(response);

                        }


                    });

                }

            });

        }

    });

});



server.listen(PORT);

console.log("Server runing at port: " + PORT + ".");