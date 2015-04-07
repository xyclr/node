/**
 * Created by cdgoujianjun on 2015/3/12.
 */
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');
var Schema = mongoose.Schema;
var Tasks = new Schema({
    project : String,
    description : String
});
mongoose.model('Task', Tasks);


//添加任务
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err){
    if(err) throw  err;
    console.log('Task saved.');
})

//搜索文档
var Task = mongoose.model('Task');
Task.find({'project' : 'Bikeshed'}, function(err,tasks){
    for(var i = 0; i < tasks.length; i++){
        console.log('ID: ' + tasks[i]._id);
        console.log(tasks[i].description);
    }
})

//更新文档
var Task = mongoose.model('Task');
Task.update({_id : '55013b7684d86ed010241202'},
    {description:'xxxxxxxxxxxxxxxxxxxxxxxxxxx'},
    {multi : false},
    function(err) {
        if(err) throw err;
        console.info('update success!!')
    }
);

//删除文档
var Task = mongoose.model('Task');
Task.findById( '55013b7684d86ed010241202', function(err, task){
    task.remove();
});