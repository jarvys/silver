var cluster = require('cluster');

if (cluster.isMaster) {
    for (var i = 0; i < 4; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var fs = require('fs');
    var http = require('http');
    
    http.createServer(function (req, res) {
        console.log('handle request', new Date());
        res.writeHead(200, {'Content-Type': 'application/json'});
        fs.readFile('./test.json', {
            encoding: "utf-8"
        }, function(e, data) {
            if (e) {
                console.error(e);
                res.end("{code: 1}");
            } else {
                res.end(data);
            }
        });
    }).listen(5000, function() {
        console.log('listening on port', 5000);
    });
}
