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
    var express = require('express');
    var app = express();
    app.use(require('morgan')());

    app.get('/test.json', function(req, res) {
        fs.readFile('./test.json', {
            encoding: "utf-8"
        }, function(e, data) {
            if (e) {
                console.error(e);
                res.json({
                    code: 1
                });
            } else {
                res.send(data);
            }
        });
    });

    app.listen(5000, function() {
        console.log('listening on port', 5000);
    });
}
