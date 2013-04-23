"use strict";

var domain = require("domain");
var http = require("http");
var atmosphericData = require("./atmosphericData");

http.createServer(function (req, res) {
    var d = domain.create();

    d.on("error", function (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.end("We encountered an error!\n\n" + err.stack);
    });

    d.run(function () {
        if (req.url === "/data") {
            atmosphericData.getNextData(function (data) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("New data: " + data);
            });
        }
    });
}).listen(1337);
