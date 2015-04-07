/**
 * Created by cdgoujianjun on 2015/3/12.
 */
var connect = require('connect');
var app = connect();
app.use(logger);
app.use('/admin', restrict);
app.use('/admin', admin);
app.use(hello);
app.listen(3000)

function logger (req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
}

function restrict(req, res, next){
    var authorization = req.headers.authorization;
    if(!authorization) return next(new Error('Unauthorized'));
    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    authenticateWidthDatabase(user, pass, function(err){
        if(err) return newt(err);
        next();
    })
}

function admin(req, res, next){
    switch (req.url){
        case '/' :
            res.end('try /users');
            break;
        case '/users' :
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'loki', 'jane']));
    }
}

function hello(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!!!');
}