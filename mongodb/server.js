/**
 * Created by cdgoujianjun on 2015/3/12.
 */
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, {w: 1});

client.open(function(err){
    if(err) throw err;
    client.collection('test_insert', function(err, collection){
        if(err) throw err;
        console.log("We are now able to perform queries.");

        //将文档插入集合中
        collection.insert(
            {
                "title" : "I like Cakesss",
                "body" : "It is quite good."
            },
            {safe : true},
            function(err, documents){
                if(err) throw err;
                console.log("Documents ID is : " + documents[0]._id);
            }
        );


        //更新文档
        var _id = new client.bson_serializer.ObjectID('5501289ade93cd5013c45fcb');
        collection.update(
            {_id : _id},
            {$set:{'title': 'I ate too much cake'}},
            {safe : true},
            function(err) {
                if(err) throw err;
                console.info('update success!!')
            }
        )

        //搜索文档
        collection.find({"title" : "I like Cake"}).toArray(
            function (err, results) {
                if(err) throw  err;
                console.log(results);
            }
        );

       /* //删除文档
        collection.remove({_id: _id},{safe : true}, function(err){
            if(err) throw err;
        })*/
    });


});

