/**/

var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

client.on('error', function(err){
    console.log('Error ' + err);
})
//键值对 操作
client.set('color', 'red', redis.print);
client.get('color',function(err, value){
    if(err) throw err;
    console.log('Got: ' + value);
})
//哈希表操作
client.hmset('camping', {
    'shelter' : '2-perser tent',
    'cooking' : 'campstove'
},redis.print);

client.hget('camping', 'cooking', function(err, value){
    if(err) throw  err;
    console.log('Will be cooling with: ' + value);
});

client.hkeys('camping', function(err, keys){
    if(err) throw err;
    keys.forEach(function(key, i){
        console.log(' ' + key);
    })
});

//链表操作
client.lpush('tasks', 'Paint th bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
client.lrange('tasks', 0, -1, function(err,items){
    if(err) throw err;
    items.forEach(function(item,i){
        console.log(' ' + item);
    })
});

//集合操作
client.sadd('ip_address', '204,10,37.96', redis.print);
client.sadd('ip_address', '1204,10,37.96', redis.print);
client.sadd('ip_address', '504,10,37.96', redis.print);
client.smembers('ip_address', function(err, members){
    if(err) throw err;
    console.log(members);
})


//信道操作
