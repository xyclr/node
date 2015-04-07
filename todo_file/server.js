var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2);

var command = args.shift();
var taskDescription = args.join(' ');
var file = path.join(process.cwd(), '/.tasks');
/*
console.log("process.argv :" + process.argv.length)
console.log("args :" + args)
console.log("command :" + command)
console.log("taskDescription :" + taskDescription)
console.log("process.cwd() :" + process.cwd())
console.log("path :" + path)
console.log("file :" + file)
*/

switch (command) {
    case 'list' :
        listTasks(file);
        break;
    case 'add' :
        addTask(file, taskDescription);
        break;
    default :
        console.log('Usage: ' + process.argv[0] + ' list!add [taskDescription]');
}

function listTasks(file) {
    loadOrInitializeTaskArry(file,function(tasks){
        for(var i in tasks){
            console.log(tasks[i]);
        }
    })
}

function addTask(file,taskDescription) {
    loadOrInitializeTaskArry(file,function(tasks){
        tasks.push(taskDescription);
        storeTasks(file,tasks);
    })
}

function loadOrInitializeTaskArry(file,cb){
    fs.exists(file,function(exists){
        var tasks = [];
        if(exists){
            fs.readFile(file,'utf8',function(err,data){
                if(err) throw err;
                var data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            })
        } else {
            cb([]);
        }
    })
}

function storeTasks(file,tasks){
    fs.writeFile(file,JSON.stringify(tasks),'utf8',function(err){
        if(err) throw err;
        console.log('Saved.');
    })
}

