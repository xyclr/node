/**
 * Created by cdgoujianjun on 2015/4/20.
 */

var server = require('./staticServer');
server.createServer(3030,function(){
    console.info("static Server start!")
})