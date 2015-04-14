
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var photos = require('./routes/photos');
var http = require('http');
var path = require('path');

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./uploads'}));//设置文件暂存目录
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('photos', __dirname + '/public/photos');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', photos.list);
app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos')));
app.get('/photo/:id/download', photos.download(app.get('photos')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

