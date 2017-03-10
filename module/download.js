/**
 * Created by mr18 on 15-12-9.
 */
var http = require("http");

var Buffer = require('buffer').Buffer;


var download = function (url, callback) {

    http.get(url, function (res) {

        var data = '';

        res.on('data', function (chunck) {
            data += chunck;
        });
        res.on('end', function () {

            var buffer = new Buffer(data).toString("utf-8");

            callback(buffer,res);
        })
    }).on('error', function () {
        callback(null);
    });
};

module.exports = download;