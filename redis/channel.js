/**
 * Created by cdgoujianjun on 2015/3/12.
 */
var net = require('net');
var redis = require('redis');

var server = net.createServer(function(socket){
    var subscriber,publisher;

    //为每个连接到聊天服务器上的用户定义设置逻辑
    socket.on('connect', function(){
        subscriber = redis.createClient(6379,'127.0.0.1');;//为用户创建预订客户端
        //预订信道
        subscriber.subscribe('main_chat_room',function(err){
            if(err) throw err;
        });
        subscriber.on('message', function(channel, message){
            socket.write('Channel ' + channel + ': ' + message);
        });
        publisher = redis.createClient(6379,'127.0.0.1');;//为用户创建发布客户端;

        console.log('Room create success!!');
        subscriber.on('error', function(err){
            console.log('Error ' + err);
        })
    });

    socket.on('data', function(data){
       publisher.publish('main_chat_room', data);
    });

    socket.on('errow', function(err){
        console.log('err: ' + err);
    });

    socket.on('end', function(){
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    })
}).listen(3000)