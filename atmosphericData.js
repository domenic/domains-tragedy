"use strict";

var EventEmitter = require("events").EventEmitter;

var dataSampler = new EventEmitter();

setInterval(function () {
    var dataGathered = Math.random(); // very rigorous

    if (Math.random() > 0.8) {
        // This won't get handled by the domain!
        dataSampler.emit("error", new Error("Error emitted on the internal `dataSampler`!"));
    }

    dataSampler.emit("newData", dataGathered);
}, 1000);

exports.getNextData = function (cb) {
    dataSampler.once("newData", cb);
};
