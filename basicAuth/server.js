var connect = require('connect');

var app = connect()
    .use(connect.basicAuth('tobi','ferret'))
    .use(function(req, res){
        res.end("I'm a secret\n");
    });

app.listen(3000)