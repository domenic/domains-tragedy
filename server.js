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
        if (Math.random() > 0.8) {
            // This will get handled by the domain!
            throw new Error("Error from immediately inside `d.run`");
        }

        if (req.url === "/data") {
            console.log("process.domain before the call into `atmosphericData.getNextData`", process.domain);

            atmosphericData.getNextData(function (data) {
                console.log("process.domain inside `atmosphericData.getNextData`", process.domain);

                if (Math.random() > 0.8) {
                    // This will not get handled by the domain, and will crash the server! We "escaped"!
                    throw new Error("Error from immediately inside `atmosphericData.getNextData`");
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("New data: " + data);
            });
        }
    });
}).listen(1337);
