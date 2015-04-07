/**
 * Created by cdgoujianjun on 2015/3/5.
 */
//将消息和昵称/房间变更请求传给服务器
var Chat  = function(socket){
    this.socket = socket;
};

Chat.prototype.sendMessage = function(room,text){
    var message = {
        room : room,
        text : text
    };
    this.socket.emit('message',message);
};

Chat.prototype.changeRoom = function(room) {
    this.socket.emit('join',{newRoom : room});
};

Chat.prototype.processCommand = function(command){
    var words = command.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var message = false;

    switch(command){
        case "join" :
            words.shift();
            var room = wors.join(' ');
            this.changeRoom(room);
            break;
        case "nickname" :
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);
            break;
        default :
            message = 'Unrecongized command.';
            break;
    }

    return message;
}


