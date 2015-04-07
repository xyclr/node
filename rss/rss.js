var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss.txt';

//确保包含RSS预订 源URL列表的文件存在
function checkForRSSFile(){
    fs.exists(configFilename,function(exists){
        if(!exists){
            return next(new Errow('Missing Rss file:' + configFilename));
        }
        next(null, configFilename);
    })
};

//读取并解析包 含预订源URL的文件
function readRSSFile(configFilename){
    fs.readFile(configFilename, function(err, feedlist){
        if(err) return next(err);
        console.info(feedlist.toString())
        feedlist = feedlist.toString().replace(/^\s+|\s+$/g,'').split("\n");
        var random = Math.floor(Math.random()*feedlist.length);
        next(null,feedlist[random]);
    })
}
//向选定的预订源发送HTTP请求以获取数据；
function downloadRSSFeed(feedUrl){
    request({uri:feedUrl}, function(err,res,body){
        if(err) return next(err);
        if(res.statusCode != 200){
            return new next(new Errow('Abnormal response status code!!!'));
        }
        next(null,body);
    })
}
//将预订源数据解析到一个条目数组中
function parseRSSFeed(rss){
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rss);
    if(!handler.dom.items.length){
        return next(new Errow('No RSS items found!!!'));
    }
    var item = handler.dom.items.shift();
    console.log(item.title);
    console.log(item.link);
}

var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];
function next(err,result){
    if(err) throw  err;
    var currentTask = tasks.shift();
    if(currentTask) {
        currentTask(result);
    }
};
next();

