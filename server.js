var connect = require('connect')
    , express = require('express')
    , fs = require('fs');
//Setup Express
var server = express();
var port = (process.env.PORT || 8083);
server.configure(function () {
    server.use(connect.bodyParser());
    server.use(connect.static(__dirname));
    server.use(server.router);
});
server.listen(port);
console.log('starting server...');
var html = fs.readFileSync(__dirname + '/demo/index.html').toString();
server.get('/*', function (req, res) {
    res.send(html);
});
console.log('Listening on http://0.0.0.0:' + port);

