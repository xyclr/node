var connect = require('connect');

function logger(req, res, next){
    console.log('%s %s', req.method, req, req.url);
    next();
}
function hello(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello word');
}

connect().use(logger).use(hello).listen(3000);