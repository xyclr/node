/**
 * Created by cdgoujianjun on 2015/3/5.
 */
var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};


exports.listen = function(server){

    //启动Socket. IO服务器， 允许它搭载 在已有的 HTTP服务 器上
    io = socketio.listen(server);
    io.set('log level', 1);

    //定义每个用户连接的处理逻辑
    io.sockets.on('connection', function(socket){

        //在用户连接上来时把他放入 聊天室Lobby
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        //处理用户的消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        //用户发出请求时，向其提供已经被占用的聊天室的列表
        socket.on('rooms', function(){
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        //定义用户断开连接后的清除逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    })
}

//分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed){
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit(
        'nameResult',
        {
            success : true,
            name : name
        }
    );
    namesUsed.push(name);
    return guestNumber + 1;
}

// 进入聊天室
function joinRoom(socket, room){
    socket.join(room);//让用户进入房间
    currentRoom[socket.id] = room;//记录用户的当前房间
    socket.emit('joinResult', {room : room});
    socket.broadcast.to(room).emit('message',function(){
        text : nickNames[socket.id] + ' has joined ' + room + '.';
    })

    var userInRoom = io.sockets.clients(room);
    if(userInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in  ' + room + ': ';
        for(var index in userInRoom) {
            var userSocketId = userInRoom[index].id;
            if(userSocketId != socket.id) {
                if(index>0) {
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
    }

    usersInRoomSummary += '.';
    socket.emit('message', {text : usersInRoomSummary})
}

//处理昵称变更请求
function handleNameChangeAttempts(socket, nickNames, namesUsed){
    socket.on('nameAttempt', function(name){
        if(name.indexOf('Guest')  == 0){
            socket.emit('nameResult',{
                success : false,
                message : 'Names cannot begin with "Guest".'
            })
        } else {
            if(namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                delete namesUsed[previousNameIndex];

                socket,emit('nameResult', {
                    success : true,
                    name : name
                });

                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text : previousName + ' is now known as ' + name + '.'
                })
            } else {
                socket.emit('nameResult',{
                    success : false,
                    message : 'That name is already in use.'
                })
            }
        }
    })
};

// 发送聊天消息
function handleMessageBroadcasting(socket){
    socket.on('message', function(message){
        socket.broadcast.to(message.room).emit('message', {
            text : nickNames[socket.id] + ": " + message.text
        })
    })
}

// 创建房间
function handleRoomJoining(socket){
    socket.on('join', function(room){
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

// 用户断开连接
function handleClientDisconnection(socket){
    socket.on('disconnect', function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}
