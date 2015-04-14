var connect = require('connect');
var __dirname  = "";
var app = connect()
    .use('/files',connect.directory(__dirname + 'public',{icons:true, hidden:true}))
    .use('/files',connect.static(__dirname +'public',{hidden:true}));

app.listen(3000)